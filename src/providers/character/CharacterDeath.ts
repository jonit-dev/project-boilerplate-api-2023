import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment, IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
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
import { CharacterInventory } from "./CharacterInventory";
import { CharacterTarget } from "./CharacterTarget";
import { CharacterWeight } from "./CharacterWeight";

export const DROP_EQUIPMENT_CHANCE = 30; // there's a 30% chance of dropping any of the equipped items
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
    private skillDecrease: SkillDecrease
  ) {}

  public async handleCharacterDeath(killer: INPC | ICharacter, character: ICharacter): Promise<void> {
    await this.clearAttackerTarget(killer);

    // send event to the character that is dead
    const dataOfCharacterDeath: IBattleDeath = {
      id: character.id,
      type: "Character",
    };

    this.socketMessaging.sendEventToUser<IBattleDeath>(
      character.channelId!,
      BattleSocketEvents.BattleDeath,
      dataOfCharacterDeath
    );
    // communicate all players around that character is dead

    await this.socketMessaging.sendEventToCharactersAroundCharacter<IBattleDeath>(
      character,
      BattleSocketEvents.BattleDeath,
      dataOfCharacterDeath
    );

    // generate character's body
    const characterBody = await this.generateCharacterBody(character);

    // drop equipped items and backpack items
    await this.dropCharacterItemsOnBody(characterBody, character.equipment);

    await this.respawnCharacter(character);
    await this.characterWeight.updateCharacterWeight(character);

    const deathPenalty = await this.skillDecrease.deathPenalty(character);
    if (deathPenalty) {
      // Set timeout to not overwrite the msg "You are Died"
      setTimeout(() => {
        this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
          message: "You received a death penalty!",
          type: "info",
        });
      }, 1500);
    }

    // finally, force disconnect character that is dead.
    this.socketMessaging.sendEventToUser(character.channelId!, BattleSocketEvents.BattleDeath, dataOfCharacterDeath);
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

  public async respawnCharacter(character: ICharacter): Promise<void> {
    await this.characterInventory.generateNewInventory(character, ContainersBlueprint.Bag, true);

    character.health = character.maxHealth;
    character.mana = character.maxMana;
    character.x = character.initialX;
    character.y = character.initialY;
    character.scene = character.initialScene;
    await character.save();
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

  private async dropCharacterItemsOnBody(characterBody: IItem, equipmentId: Types.ObjectId | undefined): Promise<void> {
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

    // drop all backpack items (inventory field)
    const inventory = equipment.inventory as unknown as IItem;
    if (inventory) {
      await this.dropInventoryItemsOnBody(itemContainer, inventory);
    }

    // there's a chance of dropping any of the equipped items
    // default chances: 30%
    await this.dropEquippedItemOnBody(itemContainer, equipment);

    itemContainer.markModified("slots");
    await itemContainer.save();
  }

  private async dropInventoryItemsOnBody(bodyContainer: IItemContainer, inventory: IItem): Promise<void> {
    const inventoryContainer = await ItemContainer.findById(inventory.itemContainer);

    if (!inventoryContainer) {
      throw new Error(`Inventory without item container. Item id ${inventory._id}`);
    }

    if (inventoryContainer.emptySlotsQty === inventoryContainer.slotQty) {
      return;
    }

    for (const i in inventoryContainer.slots) {
      if (inventoryContainer.slots[i] !== null) {
        const freeSlotId = bodyContainer.firstAvailableSlotId;
        // if there's space in body item container, then add the backpack item
        // otherwise, leave the for loop
        if (freeSlotId === null) {
          break;
        }

        const itemId = inventoryContainer.slots[i]._id;

        let item = (await Item.findById(itemId)) as IItem;

        if (item) {
          item = await this.clearItem(item);

          bodyContainer.slots[Number(freeSlotId)] = item;
          inventoryContainer.slots[Number(i)] = null;

          bodyContainer.markModified("slots");
          await bodyContainer.save();

          inventoryContainer.markModified("slots");
          await inventoryContainer.save();
        }
      }
    }
  }

  private async dropEquippedItemOnBody(bodyContainer: IItemContainer, equipment: IEquipment): Promise<void> {
    for (const slot of DROPPABLE_EQUIPMENT) {
      const itemId = await equipment[slot];

      if (!itemId) continue;

      let item = (await Item.findById(itemId)) as IItem;

      if (item) {
        await this.itemOwnership.removeItemOwnership(item);

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

    return item;
  }
}
