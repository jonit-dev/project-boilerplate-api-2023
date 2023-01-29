import { IItemUseWith } from "@providers/useWith/useWithTypes";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemRock: Partial<IItemUseWith> = {
  key: CraftingResourcesBlueprint.Rock,
  type: ItemType.CraftingResource,
  subType: ItemSubType.CraftingResource,
  textureAtlas: "items",
  texturePath: "crafting-resources/rock.png",
  name: "Rock",
  description: "A piece of Rock.",
  weight: 0.1,
  maxStackSize: 100,
  basePrice: 1,
  hasUseWith: true,
};
