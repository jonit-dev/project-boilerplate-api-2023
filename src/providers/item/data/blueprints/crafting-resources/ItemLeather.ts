import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { container } from "@providers/inversify/container";
import { UseWithItemToItem } from "@providers/useWith/abstractions/UseWithItemToItem";
import { IItemUseWith } from "@providers/useWith/useWithTypes";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemLeather: Partial<IItemUseWith> = {
  key: CraftingResourcesBlueprint.Leather,
  type: ItemType.CraftingResource,
  subType: ItemSubType.CraftingResource,
  textureAtlas: "items",
  texturePath: "crafting-resources/leather.png",
  name: "Leather",
  description: "Raw material that can be used to craft armors and other goods",
  weight: 0.7,
  maxStackSize: 20,
  basePrice: 1.5,
  hasUseWith: true,
  useWithItemEffect: async (targetItem: IItem, originItem: IItem, character: ICharacter): Promise<void> => {
    const useWithItemToItem = container.get<UseWithItemToItem>(UseWithItemToItem);

    await useWithItemToItem.execute(targetItem, originItem, character, "cutting-wood");
  },
};
