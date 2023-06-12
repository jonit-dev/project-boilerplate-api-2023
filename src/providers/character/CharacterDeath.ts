import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment, IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { NewRelic } from "@providers/analytics/NewRelic";
import { DROP_EQUIPMENT_CHANCE } from "@providers/constants/DeathConstants";
import { EntityEffectUse } from "@providers/entityEffects/EntityEffectUse";
import { EquipmentSlotTypes, EquipmentSlots } from "@providers/equipment/EquipmentSlots";
import { ItemOwnership } from "@providers/item/ItemOwnership";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import {
  AccessoriesBlueprint,
  BodiesBlueprint,
  ContainersBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { NPCTarget } from "@providers/npc/movement/NPCTarget";
import { SkillDecrease } from "@providers/skill/SkillDecrease";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { NewRelicTransactionCategory } from "@providers/types/NewRelicTypes";
import { BattleSocketEvents, IBattleDeath, IUIShowMessage, UISocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import _ from "lodash";
import { Types } from "mongoose";
import { CharacterDeathCalculator } from "./CharacterDeathCalculator";
import { CharacterInventory } from "./CharacterInventory";
import { CharacterTarget } from "./CharacterTarget";
import { CharacterWeight } from "./CharacterWeight";
import { CharacterItemContainer } from "./characterItems/CharacterItemContainer";

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
    private characterDeathCalculator: CharacterDeathCalculator,
    private characterItemContainer: CharacterItemContainer,
    private entityEffectUse: EntityEffectUse,
    private equipmentSlots: EquipmentSlots,
    private newRelic: NewRelic
  ) {}

  public async handleCharacterDeath(killer: INPC | ICharacter | null, character: ICharacter): Promise<void> {
    await this.newRelic.trackTransaction(
      NewRelicTransactionCategory.Operation,
      "CharacterDeath.handleCharacterDeath",
      async () => {
        try {
          if (character.health > 0) {
            // if by any reason the char is not dead, make sure it is.
            await Character.updateOne({ _id: character._id }, { $set: { health: 0 } });
            character.health = 0;
            character.isAlive = false;
          }

          if (killer) {
            await this.clearAttackerTarget(killer);
          }

          const characterDeathData: IBattleDeath = {
            id: character.id,
            type: "Character",
          };
          this.socketMessaging.sendEventToUser(
            character.channelId!,
            BattleSocketEvents.BattleDeath,
            characterDeathData
          );

          // communicate all players around that character is dead

          await this.socketMessaging.sendEventToCharactersAroundCharacter<IBattleDeath>(
            character,
            BattleSocketEvents.BattleDeath,
            characterDeathData
          );

          const amuletOfDeath = await this.equipmentSlots.hasItemByKeyOnSlot(
            character,
            AccessoriesBlueprint.AmuletOfDeath,
            "neck"
          );

          // generate character's body
          const characterBody = await this.generateCharacterBody(character);

          if (!amuletOfDeath) {
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
          } else {
            setTimeout(() => {
              this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
                message: "Your Amulet of Death protected your XP and skill points.",
                type: "info",
              });
            }, 2000);

            await this.equipmentSlots.removeItemFromSlot(character, AccessoriesBlueprint.AmuletOfDeath, "neck");
          }

          await this.entityEffectUse.clearAllEntityEffects(character);
          await this.characterWeight.updateCharacterWeight(character);
        } finally {
          await this.respawnCharacter(character);
        }
      }
    );
  }

  public async generateCharacterBody(character: ICharacter): Promise<IItem> {
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

    await charBody.save();

    return charBody;
  }

  public async respawnCharacter(character: ICharacter): Promise<void> {
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

    const equipment = await Equipment.findById(equipmentId).populate("inventory").exec();
    if (!equipment) {
      throw new Error(`No equipment found for id ${equipmentId}`);
    }

    // get item container associated with characterBody
    const bodyContainer = await ItemContainer.findById(characterBody.itemContainer);

    if (!bodyContainer) {
      throw new Error(`Error fetching itemContainer for Item with key ${characterBody.key}`);
    }

    // drop backpack
    const inventory = equipment.inventory as unknown as IItem;
    if (inventory) {
      await this.dropInventory(character, bodyContainer, inventory);
    }

    // there's a chance of dropping any of the equipped items
    await this.dropEquippedItemOnBody(character, bodyContainer, equipment);
  }

  private async dropInventory(character: ICharacter, bodyContainer: IItemContainer, inventory: IItem): Promise<void> {
    const n = _.random(0, 100);
    let isDeadBodyLootable = false;

    const skills = (await Skill.findById(character.skills)) as ISkill;

    const dropInventoryChance = this.characterDeathCalculator.calculateInventoryDropChance(skills);

    if (n <= dropInventoryChance) {
      let item = (await Item.findById(inventory._id)) as IItem;

      item = await this.clearItem(item);

      // now that the slot is clear, lets drop the item on the body
      await this.characterItemContainer.addItemToContainer(item, character, bodyContainer._id);

      if (!isDeadBodyLootable) {
        isDeadBodyLootable = true;
        await Item.updateOne({ _id: bodyContainer.parentItem }, { $set: { isDeadBodyLootable: true } });
      }

      setTimeout(() => {
        this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
          message: "You dropped your inventory.",
          type: "info",
        });
      }, 4000);

      await this.characterInventory.generateNewInventory(character, ContainersBlueprint.Bag, true);
    }
  }

  private async dropEquippedItemOnBody(
    character: ICharacter,
    bodyContainer: IItemContainer,
    equipment: IEquipment
  ): Promise<void> {
    let isDeadBodyLootable = false;

    for (const slot of DROPPABLE_EQUIPMENT) {
      const itemId = equipment[slot];

      if (!itemId) continue;

      let item = (await Item.findById(itemId)) as IItem;

      if (!item) {
        throw new Error(`Error fetching item with id ${itemId}`);
      }

      const n = _.random(0, 100);

      if (n <= DROP_EQUIPMENT_CHANCE) {
        const removeEquipmentFromSlot = await this.equipmentSlots.removeItemFromSlot(
          character,
          item.key,
          slot as EquipmentSlotTypes
        );

        if (!removeEquipmentFromSlot) {
          return;
        }

        item = await this.clearItem(item);

        // now that the slot is clear, lets drop the item on the body
        await this.characterItemContainer.addItemToContainer(item, character, bodyContainer._id);

        if (!isDeadBodyLootable) {
          isDeadBodyLootable = true;
          await Item.updateOne({ _id: bodyContainer.parentItem }, { $set: { isDeadBodyLootable: true } });
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
