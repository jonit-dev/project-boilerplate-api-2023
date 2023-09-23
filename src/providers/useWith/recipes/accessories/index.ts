import { AccessoriesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { recipeAmuletOfDeath } from "./recipeAmuletOfDeath";
import { recipeBandana } from "./recipeBandana";
import { recipeBloodstoneAmulet } from "./recipeBloodstoneAmulet";
import { recipeCorruptionNecklace } from "./recipeCorruptionNecklace";
import { recipeDeathNecklace } from "./recipeDeathNecklace";
import { recipeElvenRing } from "./recipeElvenRing";
import { recipeEmeraldEleganceNecklace } from "./recipeEmeraldEleganceNecklace";
import { recipeHasteRing } from "./recipeHasteRing";
import { recipeOrcRing } from "./recipeOrcRing";
import { recipePendantOfLife } from "./recipePendantOfLife";

export const recipeAccessoriesIndex: Record<string, IUseWithCraftingRecipe[]> = {
  [AccessoriesBlueprint.Bandana]: [recipeBandana],
  [AccessoriesBlueprint.CorruptionNecklace]: [recipeCorruptionNecklace],
  [AccessoriesBlueprint.DeathNecklace]: [recipeDeathNecklace],
  [AccessoriesBlueprint.ElvenRing]: [recipeElvenRing],
  [AccessoriesBlueprint.HasteRing]: [recipeHasteRing],
  [AccessoriesBlueprint.OrcRing]: [recipeOrcRing],
  [AccessoriesBlueprint.PendantOfLife]: [recipePendantOfLife],
  [AccessoriesBlueprint.AmuletOfDeath]: [recipeAmuletOfDeath],
  [AccessoriesBlueprint.BloodstoneAmulet]: [recipeBloodstoneAmulet],
  [AccessoriesBlueprint.EmeraldEleganceNecklace]: [recipeEmeraldEleganceNecklace],
};
