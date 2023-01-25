import { IItemUseWith } from "@providers/useWith/useWithTypes";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemSmallWoodenStick: Partial<IItemUseWith> = {
  key: CraftingResourcesBlueprint.SmallWoodenStick,
  type: ItemType.CraftingResource,
  subType: ItemSubType.CraftingResource,
  textureAtlas: "items",
  texturePath: "crafting-resources/small-wooden-sticks.png",
  name: "Small Wooden Sticks",
  description: "Small Wooden sticks used for crafting.",
  weight: 1,
  maxStackSize: 10,
};
