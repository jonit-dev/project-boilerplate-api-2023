import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { container } from "@providers/inversify/container";
import { UseWithItemToItem } from "@providers/useWith/abstractions/UseWithItemToItem";
import { IItemUseWith } from "@providers/useWith/useWithTypes";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemGreaterWoodenLog: Partial<IItemUseWith> = {
  key: CraftingResourcesBlueprint.GreaterWoodenLog,
  type: ItemType.CraftingResource,
  subType: ItemSubType.CraftingResource,
  textureAtlas: "items",
  texturePath: "crafting-resources/greater-wooden-log.png",
  name: "Greater Wooden Log",
  description: "A heavy crafting resource that is generally split into smaller logs before usage.",
  weight: 1.5,
  maxStackSize: 20,
  basePrice: 0.5,
  hasUseWith: true,
  useWithItemEffect: async (targetItem: IItem, originItem: IItem, character: ICharacter): Promise<void> => {
    const useWithItemToItem = container.get<UseWithItemToItem>(UseWithItemToItem);

    await useWithItemToItem.execute(targetItem, originItem, character, "cutting-wood");
  },
};
