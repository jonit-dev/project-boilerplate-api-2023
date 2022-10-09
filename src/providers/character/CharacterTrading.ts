import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment } from "@entities/ModuleCharacter/EquipmentModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { Item } from "@entities/ModuleInventory/ItemModel";

import { provide } from "inversify-binding-decorators";
import { Types } from "mongoose";

@provide(CharacterTrading)
export class CharacterTrading {
  public async updateCharacterGold(character: ICharacter): Promise<void> {
    const gold = await this.getTotalGoldCoins(character);

    await Character.updateOne(
      {
        _id: character._id,
      },
      {
        $set: {
          gold,
        },
      }
    );
  }

  public async getTotalGoldCoins(character: ICharacter): Promise<number> {
    const equipment = await Equipment.findById(character.equipment);
    const inventory = await character.inventory;
    const inventoryContainer = await ItemContainer.findById(inventory?.itemContainer);

    let totalGold = 0;
    if (equipment) {
      const { head, neck, leftHand, rightHand, ring, legs, boot, accessory, armor, inventory } = equipment;
      const slots: Types.ObjectId[] = [
        head!,
        neck!,
        leftHand!,
        rightHand!,
        ring!,
        legs!,
        boot!,
        accessory!,
        armor!,
        inventory!,
      ];

      for (const slot of slots) {
        const item = await Item.findById(slot).lean();
        if (item) {
          totalGold += item.goldPrice!;
        }
      }
    }

    if (inventoryContainer) {
      for (const bagItem of inventoryContainer.itemIds) {
        const item = await Item.findById(bagItem).lean();
        if (item) {
          totalGold += item.goldPrice!;
        }
      }
    }

    return totalGold;
  }
}
