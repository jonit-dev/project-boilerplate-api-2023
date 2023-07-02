import { ICraftableItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";
import { UsableEffectsBlueprint } from "../../usableEffects/types";

export const itemBandage: ICraftableItemBlueprint = {
  key: CraftingResourcesBlueprint.Bandage,
  type: ItemType.Consumable,
  subType: ItemSubType.CraftingResource,
  textureAtlas: "items",
  texturePath: "crafting-resources/bandage.png",
  name: "Bandage",
  description: "A piece of soft cloth material that can be used to stop bleeding.",
  weight: 0.04,
  maxStackSize: 100,
  basePrice: 12,
  usableEffectKey: UsableEffectsBlueprint.ClearBleedingUsableEffect,
};
