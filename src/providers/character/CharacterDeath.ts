import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment, IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { Item } from "@entities/ModuleInventory/ItemModel";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { BodiesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { BattleSocketEvents, IBattleDeath, IItem } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import _ from "lodash";
import { Types } from "mongoose";

const DROP_EQUIPMENT_CHANCE = 30; // there's a 30% chance of dropping any of the equipped items
const DROPPABLE_EQUIPMENT = ["head", "neck", "leftHand", "rightHand", "ring", "legs", "boot", "accessory", "armor"];

@provide(CharacterDeath)
export class CharacterDeath {
  constructor(private socketMessaging: SocketMessaging) {}

  public async handleCharacterDeath(character: ICharacter): Promise<void> {
    console.log(`💀 Character ${character.name} is dead 💀`);

    // send event to the character that is dead

    this.socketMessaging.sendEventToUser<IBattleDeath>(character.channelId!, BattleSocketEvents.BattleDeath, {
      id: character.id,
      type: "Character",
    });
    // communicate all players around that character is dead

    await this.socketMessaging.sendMessageToCloseCharacters<IBattleDeath>(character, BattleSocketEvents.BattleDeath, {
      id: character.id,
      type: "Character",
    });

    // generate character's body
    const characterBody = await this.generateCharacterBody(character);

    // drop equipped items and backpack items
    await this.dropCharacterItemsOnBody(characterBody, character.equipment);

    // Restart health and X,Y after death.
    await this.respawnCharacter(character);

    // finally, force disconnect character that is dead.
    this.socketMessaging.sendEventToUser(character.channelId!, BattleSocketEvents.BattleDeath, {
      id: character.id,
      type: "Character",
    });

    // TODO: Add death penalty here.
  }

  public generateCharacterBody(character: ICharacter): Promise<IItem | any> {
    const blueprintData = itemsBlueprintIndex[BodiesBlueprint.CharacterBody];

    const charBody = new Item({
      ...blueprintData,
      owner: character.id,
      name: `${character.name}'s body`,
      scene: character.scene,
      x: character.x,
      y: character.y,
    });

    return charBody.save();
  }

  public async respawnCharacter(character: ICharacter): Promise<void> {
    character.health = character.maxHealth;
    character.mana = character.maxMana;
    character.x = character.initialX;
    character.y = character.initialY;
    character.scene = character.initialScene;
    await character.save();
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
    const backpack = equipment.inventory as unknown as IItem;
    if (backpack) {
      await this.dropBackpackItemsOnBody(itemContainer, backpack);
    }

    // there's a chance of dropping any of the equipped items
    // default chances: 30%
    await this.dropEquippedItemOnBody(itemContainer, equipment, DROP_EQUIPMENT_CHANCE);

    itemContainer.markModified("slots");
    await itemContainer.save();
  }

  private async dropBackpackItemsOnBody(bodyContainer: IItemContainer, backpack: IItem): Promise<void> {
    const backpackContainer = await ItemContainer.findById(backpack.itemContainer);

    if (!backpackContainer) {
      throw new Error(`Backpack without item container. Item id ${backpack._id}`);
    }

    if (backpackContainer.emptySlotsQty === backpackContainer.slotQty) {
      return;
    }

    for (const i in backpackContainer.slots) {
      if (backpackContainer.slots[i] !== null) {
        const freeSlotId = bodyContainer.firstAvailableSlotId;
        // if there's space in body item container, then add the backpack item
        // otherwise, leave the for loop
        if (freeSlotId === null) {
          break;
        }
        bodyContainer.slots[Number(freeSlotId)] = backpackContainer.slots[i];
        backpackContainer.slots[Number(i)] = null;
      }
    }

    backpackContainer.markModified("slots");
    await backpackContainer.save();
  }

  private async dropEquippedItemOnBody(
    bodyContainer: IItemContainer,
    equipment: IEquipment,
    dropEquipmentChance: number
  ): Promise<void> {
    const rand = Math.round(_.random(0, 100));
    if (rand > dropEquipmentChance) {
      return;
    }

    const equipLength = DROPPABLE_EQUIPMENT.length;
    // randomnly select the equipment to drop (head, neck, etc..)
    // if not equipped, then check next one
    let equipmentName: any;
    let foundEquipment = false;
    for (let i = 0; i < equipLength; i++) {
      equipmentName = DROPPABLE_EQUIPMENT[(rand + i) % equipLength];
      if (equipment[equipmentName] !== undefined && equipment[equipmentName] !== null) {
        foundEquipment = true;
        break;
      }
    }

    if (foundEquipment) {
      const freeSlotId = bodyContainer.firstAvailableSlotId;
      // if there's space in body item container, then add the item
      if (freeSlotId !== null) {
        bodyContainer.slots[Number(freeSlotId)] = equipment[equipmentName];
        equipment[equipmentName] = undefined;
        await equipment.save();
      }
    }
  }
}
