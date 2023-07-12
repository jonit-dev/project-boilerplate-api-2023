import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment } from "@entities/ModuleCharacter/EquipmentModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { isSameKey } from "@providers/dataStructures/KeyHelper";
import { EquipmentSlots } from "@providers/equipment/EquipmentSlots";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";

import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { ItemWeightTracker } from "@providers/item/ItemWeightTracker";
import { MathHelper } from "@providers/math/MathHelper";
import { provide } from "inversify-binding-decorators";
import { CharacterWeight } from "../CharacterWeight";
import { CharacterItemBuff } from "../characterBuff/CharacterItemBuff";

@provide(CharacterItemEquipment)
export class CharacterItemEquipment {
  constructor(
    private equipmentSlots: EquipmentSlots,
    private socketMessaging: SocketMessaging,
    private mathHelper: MathHelper,
    private characterItemBuff: CharacterItemBuff,
    private itemWeightTracker: ItemWeightTracker,
    private characterWeight: CharacterWeight
  ) {}

  @TrackNewRelicTransaction()
  public async deleteItemFromEquipment(itemId: string, character: ICharacter): Promise<boolean> {
    const item = (await Item.findById(itemId).lean()) as unknown as IItem;

    if (!item) {
      this.socketMessaging.sendErrorMessageToCharacter(
        character,
        "Oops! The item to be deleted from your equipment was not found."
      );
      return false;
    }

    const equipment = await Equipment.findById(character.equipment).cacheQuery({
      cacheKey: `${character._id}-equipment`,
    });

    if (!equipment) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Oops! Your equipment was not found.");
      return false;
    }

    await this.characterItemBuff.disableItemBuff(character, itemId);

    return await this.removeItemFromEquipmentSet(item, character);
  }

  @TrackNewRelicTransaction()
  public async decrementItemFromEquipment(
    itemKey: string,
    character: ICharacter,
    decrementQty: number,
    equipmentSlot?: string
  ): Promise<boolean> {
    const equipment = await Equipment.findById(character.equipment).cacheQuery({
      cacheKey: `${character._id}-equipment`,
    });

    if (!equipment) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Oops! Your equipment was not found.");
      return false;
    }

    let item: IItem | undefined;

    // decrement from a specific equipment slot
    if (equipmentSlot) {
      let value = (await Item.findById(equipment[equipmentSlot])) as unknown as IItem;
      if (!value) {
        this.socketMessaging.sendErrorMessageToCharacter(
          character,
          `Oops! Nothing found on equipment slot ${equipmentSlot}.`
        );
        return false;
      }
      if (!value.key) {
        value = (await Item.findById(value as any).lean()) as unknown as IItem;
      }
      if (!value) {
        this.socketMessaging.sendErrorMessageToCharacter(
          character,
          `Oops! Nothing found on equipment slot ${equipmentSlot}.`
        );
        return false;
      }
      if (isSameKey(value.key, itemKey)) {
        item = value;
      }
    } else {
      // decrement from the first slot where it finds the item
      const equipmentSlots = await this.equipmentSlots.getEquipmentSlots(character._id, equipment._id);
      for (let [, value] of Object.entries(equipmentSlots)) {
        if (!value) {
          continue;
        }

        if (!value.key) {
          value = (await Item.findById(value as any).lean()) as unknown as IItem;
        }

        // item not found, continue
        if (!value) {
          continue;
        }

        if (isSameKey(value.key, itemKey)) {
          item = value;
        }
      }
    }

    if (!item) {
      return false;
    }

    let result = false;
    if (item.maxStackSize > 1) {
      // if its stackable, decrement the stack
      let remaining = 0;

      if (decrementQty <= item.stackQty!) {
        remaining = this.mathHelper.fixPrecision(item.stackQty! - decrementQty);
        decrementQty = 0;
      } else {
        decrementQty = this.mathHelper.fixPrecision(decrementQty - item.stackQty!);
      }

      if (remaining > 0) {
        await Item.updateOne(
          {
            _id: item._id,
          },
          {
            $set: {
              stackQty: remaining,
            },
          }
        );
        result = true;

        await this.handleItemStackWeightDecrease(item, character, 1); // lets just decrement 1 from the stack
      } else {
        result = await this.deleteItemFromEquipment(item._id, character);
        // we also need to delete item from items table
        await Item.deleteOne({ _id: item._id }, { skipEquipmentCheck: true });
      }
    } else {
      // if its not stackable, just remove it
      result = await this.deleteItemFromEquipment(item._id, character);
      // we also need to delete item from items table
      await Item.deleteOne({ _id: item._id }, { skipEquipmentCheck: true });
    }

    if (!result) {
      return false;
    }

    return true;
  }

  @TrackNewRelicTransaction()
  public async checkItemEquipment(itemId: string, character: ICharacter): Promise<boolean> {
    const equipment = await Equipment.findById(character.equipment).cacheQuery({
      cacheKey: `${character._id}-equipment`,
    });

    if (!equipment) {
      return false;
    }

    const equipmentSlots = await this.equipmentSlots.getEquipmentSlots(character._id, equipment._id);

    for (const [, value] of Object.entries(equipmentSlots)) {
      if (String(value?._id) === String(itemId)) {
        return true;
      }
    }

    return false;
  }

  /**
   * checkItemEquipmentByKey returns the item id if found, otherwise returns undefined
   * @param itemKey
   * @param character
   * @returns the item id if found, otherwise returns undefined
   */
  @TrackNewRelicTransaction()
  public async checkItemEquipmentByKey(itemKey: string, character: ICharacter): Promise<string | undefined> {
    const equipment = await Equipment.findById(character.equipment).cacheQuery({
      cacheKey: `${character._id}-equipment`,
    });

    if (!equipment) {
      return;
    }

    const equipmentSlots = await this.equipmentSlots.getEquipmentSlots(character._id, equipment._id);

    for (let [, value] of Object.entries(equipmentSlots)) {
      if (!value) {
        continue;
      }

      if (!value.key) {
        value = (await Item.findById(value as any).lean()) as unknown as IItem;
      }

      // item not found, continue
      if (!value) {
        continue;
      }

      if (isSameKey(value.key, itemKey)) {
        return value._id;
      }
    }
  }

  private async handleItemStackWeightDecrease(item: IItem, character: ICharacter, qty: number): Promise<void> {
    if (!item.stackQty) {
      return;
    }

    const weightDecrement = item.weight * qty; // just 1 from the stack!

    const newWeight = character.weight - weightDecrement;

    await this.characterWeight.updateCharacterWeightTo(character, newWeight);
  }

  @TrackNewRelicTransaction()
  private async removeItemFromEquipmentSet(item: IItem, character: ICharacter): Promise<boolean> {
    const equipmentSetId = character.equipment;
    const equipmentSet = await Equipment.findById(equipmentSetId).cacheQuery({
      cacheKey: `${character._id}-equipment`,
    });

    if (!equipmentSet) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Oops! Your equipment was not found.");
      return false;
    }

    let targetSlot = "";
    const itemSlotTypes = [
      "head",
      "neck",
      "leftHand",
      "rightHand",
      "ring",
      "legs",
      "boot",
      "accessory",
      "armor",
      "inventory",
    ];

    for (const itemSlotType of itemSlotTypes) {
      if (equipmentSet[itemSlotType] && equipmentSet[itemSlotType].toString() === item._id.toString()) {
        targetSlot = itemSlotType;
      }
    }

    if (!targetSlot) {
      return false;
    }

    await Equipment.updateOne(
      {
        _id: equipmentSetId,
      },
      {
        $unset: {
          [targetSlot]: 1,
        },
      }
    );

    await this.itemWeightTracker.removeItemWeightTracking(item);

    return true;
  }
}
