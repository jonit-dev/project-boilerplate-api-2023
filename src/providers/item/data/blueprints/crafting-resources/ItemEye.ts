import { IItemUseWith } from "@providers/useWith/useWithTypes";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemEye: Partial<IItemUseWith> = {
  key: CraftingResourcesBlueprint.Eye,
  type: ItemType.CraftingResource,
  subType: ItemSubType.CraftingResource,
  textureAtlas: "items",
  texturePath: "crafting-resources/eye.png",
  name: "Eye",
  description: "A valuable resource collected from fallen enemies, used for crafting weapons or tools.",
  weight: 0.2,
  maxStackSize: 100,
  basePrice: 8,
  hasUseWith: true,
};
