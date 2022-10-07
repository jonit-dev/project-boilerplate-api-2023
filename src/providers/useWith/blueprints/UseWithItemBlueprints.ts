import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { MagicsBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";

export interface IUseWithItemEffect {
  (targetItem: IItem, originItem: IItem, character: ICharacter): Promise<void>;
}

interface IUseWithItemBlueprint {
  [key: string]: IUseWithItemEffect;
}

export const useWithItemBlueprints: IUseWithItemBlueprint = {
  // This is just an example, feel free to remove/change this
  [SwordsBlueprint.DragonsSword]: async (
    targetItem: IItem,
    originItem: IItem,
    character: ICharacter
  ): Promise<void> => {
    switch (originItem.baseKey) {
      case MagicsBlueprint.Rune:
        // Example effect: increase weapon attack
        targetItem.attack! += 5;
        await targetItem.save();
        break;
      default:
        throw new Error(`Cannot use '${targetItem.baseKey}' with '${originItem.baseKey}'`);
    }
  },
};
