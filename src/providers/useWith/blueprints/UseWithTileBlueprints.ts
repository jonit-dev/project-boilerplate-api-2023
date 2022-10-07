import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment } from "@entities/ModuleCharacter/EquipmentModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { AxesBlueprint, OthersBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";

export interface IUseWithTileEffect {
  (item: IItem, character: ICharacter): Promise<void>;
}

interface IUseWithTileBlueprint {
  [key: string]: IUseWithTileEffect;
}

export const useWithTileBlueprints: IUseWithTileBlueprint = {
  // This is just an example, feel free to remove/change this
  [AxesBlueprint.Pickaxe]: async (item: IItem, character: ICharacter): Promise<void> => {
    // EXAMPLE: Using pickaxe with tile will mint 5 gold coins to the characters bag

    const coinBlueprint = itemsBlueprintIndex[OthersBlueprint.GoldCoin];
    const newCoins = new Item({ ...coinBlueprint });
    newCoins.stackQty = 5;

    const equipment = await Equipment.findById(character.equipment).populate("inventory").exec();
    if (!equipment) {
      throw new Error("Character does not have equipment");
    }
    const backpack = equipment.inventory as unknown as IItem;
    const backpackContainer = (await ItemContainer.findById(backpack.itemContainer)) as unknown as IItemContainer;

    const slotId = backpackContainer.firstAvailableSlotId;
    if (slotId === null) {
      // No slots available
      return;
    }
    backpackContainer.slots[slotId] = await newCoins.save();

    backpackContainer.markModified("slots");
    await backpackContainer.save();
  },
};
