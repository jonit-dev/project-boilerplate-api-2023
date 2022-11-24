import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { container } from "@providers/inversify/container";
import { UseWithWoodenSticks } from "@providers/useWith/items/UseWithWoodenSticks";
import { IItemUseWith } from "@providers/useWith/useWithTypes";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemWoodenSticks: Partial<IItemUseWith> = {
  key: CraftingResourcesBlueprint.WoodenSticks,
  type: ItemType.CraftingResource,
  subType: ItemSubType.CraftingResource,
  textureAtlas: "items",
  texturePath: "crafting-resources/wooden-sticks.png",
  name: "Wooden Sticks",
  description: "Wooden sticks used for crafting.",
  weight: 1,
  useWithItemEffect: async (targetItem: IItem, originItem: IItem, character: ICharacter): Promise<void> => {
    const useWithWoodenSticks = container.get<UseWithWoodenSticks>(UseWithWoodenSticks);

    await useWithWoodenSticks.execute(targetItem, originItem, character);
  },
  maxStackSize: 100,
};
