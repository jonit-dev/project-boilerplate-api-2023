import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment, IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { DROP_EQUIPMENT_CHANCE } from "@providers/constants/DeathConstants";
import { ItemOwnership } from "@providers/item/ItemOwnership";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { BodiesBlueprint, ContainersBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { NPCTarget } from "@providers/npc/movement/NPCTarget";
import { SkillDecrease } from "@providers/skill/SkillDecrease";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { BattleSocketEvents, IBattleDeath, IUIShowMessage, UISocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import _ from "lodash";
import { Types } from "mongoose";
import { CharacterDeathCalculator } from "./CharacterDeathCalculator";
import { CharacterInventory } from "./CharacterInventory";
import { CharacterTarget } from "./CharacterTarget";
import { CharacterWeight } from "./CharacterWeight";

export const DROPPABLE_EQUIPMENT = [
  "head",
  "neck",
  "leftHand",
  "rightHand",
  "ring",
  "legs",
  "boot",
  "accessory",
  "armor",
];

@provide(CharacterDeath)
export class CharacterDeath {
  constructor(
    private socketMessaging: SocketMessaging,
    private characterTarget: CharacterTarget,
    private npcTarget: NPCTarget,
    private characterInventory: CharacterInventory,
    private itemOwnership: ItemOwnership,
    private characterWeight: CharacterWeight,
    private skillDecrease: SkillDecrease,
    private characterDeathCalculator: CharacterDeathCalculator
  ) {}

  public async handleCharacterDeath(killer: INPC | ICharacter | null, character: ICharacter): Promise<void> {
    await character.lockField("x");
    await character.lockField("y");
    await character.lockField("scene");

    if (killer) {
      await this.clearAttackerTarget(killer);
    }

    // generate character's body
    const characterBody = await this.generateCharacterBody(character);

    // drop equipped items and backpack items
    await this.dropCharacterItemsOnBody(character, characterBody, character.equipment);

    const deathPenalty = await this.skillDecrease.deathPenalty(character);
    if (deathPenalty) {
      // Set timeout to not overwrite the msg "You are Died"
      setTimeout(() => {
        this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
          message: "You lost some XP and skill points.",
          type: "info",
        });
      }, 2000);
    }

    const characterDeathData: IBattleDeath = {
      id: character.id,
      type: "Character",
    };
    this.socketMessaging.sendEventToUser(character.channelId!, BattleSocketEvents.BattleDeath, characterDeathData);

    // communicate all players around that character is dead

    await this.socketMessaging.sendEventToCharactersAroundCharacter<IBattleDeath>(
      character,
      BattleSocketEvents.BattleDeath,
      characterDeathData
    );

    await character.unlockField("x");
    await character.unlockField("y");
    await character.unlockField("scene");

    await this.respawnCharacter(character);
    await this.characterWeight.updateCharacterWeight(character);
  }

  public async generateCharacterBody(character: ICharacter): Promise<IItem | any> {
    const blueprintData = itemsBlueprintIndex[BodiesBlueprint.CharacterBody];

    const charBody = new Item({
      ...blueprintData,
      bodyFromId: character.id,
      name: `${character.name}'s body`,
      scene: character.scene,
      texturePath: `${character.textureKey}/death/0.png`,
      x: character.x,
      y: character.y,
    });

    return await charBody.save();
  }

  private async respawnCharacter(character: ICharacter): Promise<void> {
    await Character.updateOne(
      { _id: character._id },
      {
        $set: {
          health: character.maxHealth,
          mana: character.maxMana,
          x: character.initialX,
          y: character.initialY,
          scene: character.initialScene,
          appliedEntityEffects: [],
        },
      }
    );
  }

  private async clearAttackerTarget(attacker: ICharacter | INPC): Promise<void> {
    if (attacker.type === "Character") {
      // clear killer's target
      await this.characterTarget.clearTarget(attacker as ICharacter);
    }

    if (attacker.type === "NPC") {
      await this.npcTarget.clearTarget(attacker as INPC);
    }
  }

  private async dropCharacterItemsOnBody(
    character: ICharacter,
    characterBody: IItem,
    equipmentId: Types.ObjectId | undefined
  ): Promise<void> {
    if (!equipmentId) {
      return;
    }

    // get item container associated with characterBody
    const itemContainer = await ItemContainer.findById(characterBody.itemContainer);

    if (!itemContainer) {
      throw new Error(`Error fetching itemContainer for Item with key ${characterBody.key}`);
    }

    const equipment = await Equipment.findById(equipmentId).populate("inventory").exec();
    if (!equipment) {
      throw new Error(`No equipment found for id ${equipmentId}`);
    }

    // drop backpack
    const inventory = equipment.inventory as unknown as IItem;
    if (inventory) {
      await this.dropInventory(character, itemContainer, inventory);
    }

    // there's a chance of dropping any of the equipped items
    await this.dropEquippedItemOnBody(itemContainer, equipment);

    itemContainer.markModified("slots");
    await itemContainer.save();
  }

  private async dropInventory(character: ICharacter, bodyContainer: IItemContainer, inventory: IItem): Promise<void> {
    const n = _.random(0, 100);

    const skills = (await Skill.findById(character.skills)) as ISkill;

    const dropInventoryChance = this.characterDeathCalculator.calculateInventoryDropChance(skills);

    if (n <= dropInventoryChance) {
      // drop current inventory
      const freeSlotId = bodyContainer.firstAvailableSlotId;
      let item = (await Item.findById(inventory._id)) as IItem;
      item = await this.clearItem(item);
      bodyContainer.slots[Number(freeSlotId)] = item;
      await bodyContainer.save();

      setTimeout(() => {
        this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
          message: "You dropped your inventory.",
          type: "info",
        });
      }, 4000);

      await this.characterInventory.generateNewInventory(character, ContainersBlueprint.Bag, true);
    }
  }

  private async dropEquippedItemOnBody(bodyContainer: IItemContainer, equipment: IEquipment): Promise<void> {
    for (const slot of DROPPABLE_EQUIPMENT) {
      const itemId = await equipment[slot];

      if (!itemId) continue;

      let item = (await Item.findById(itemId)) as IItem;

      if (item) {
        const n = _.random(0, 100);

        if (n <= DROP_EQUIPMENT_CHANCE) {
          const freeSlotId = bodyContainer.firstAvailableSlotId;
          if (freeSlotId !== null) {
            item = await this.clearItem(item);
            bodyContainer.slots[Number(freeSlotId)] = item;
            equipment[slot] = undefined;

            bodyContainer.markModified("slots");
            await bodyContainer.save();

            equipment.markModified(slot);
            await equipment.save();
          }
        }
      }
    }
  }

  private async clearItem(item: IItem): Promise<IItem> {
    item.x = undefined;
    item.y = undefined;
    item.owner = undefined;
    item.scene = undefined;
    item.tiledId = undefined;
    await item.save();

    await this.itemOwnership.removeItemOwnership(item);

    return item;
  }
}
