import { SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { recipeBasiliskSword } from "./recipeBasiliskSword";
import { recipeBroadSword } from "./recipeBroadSword";
import { recipeBronzeFuryBroadsword } from "./recipeBronzeFuryBroadsword";
import { recipeCenturionBroadsword } from "./recipeCenturionBroadsword";
import { recipeCopperBroadsword } from "./recipeCopperBroadsword";
import { recipeCorruptionSword } from "./recipeCorruptionSword";
import { recipeDiamondSword } from "./recipeDiamondSword";
import { recipeElucidatorSword } from "./recipeElucidatorSword";
import { recipeElvenSword } from "./recipeElvenSword";
import { recipeEmeraldBroadsword } from "./recipeEmeraldBroadsword";
import { recipeFireSword } from "./recipeFireSword";
import { recipeGhostTalonSword } from "./recipeGhostTalonSword";
import { recipeGorgonBlade } from "./recipeGorgonBlade";
import { recipeHellfireEdgeSword } from "./recipeHellfireEdgeSword";
import { recipeFrostbiteBlade } from "./recipeIceFrostbiteBlade";
import { recipeFrostguardSword } from "./recipeIceFrostguardSword";
import { recipeIronwoodTanto } from "./recipeIceIronwoodTanto";
import { recipeIceShardLongsword } from "./recipeIceShardLongsword";
import { recipeIceSword } from "./recipeIceSword";
import { recipeTungstenSword } from "./recipeIceTungstenSword";
import { recipeInfernoEdgeSword } from "./recipeInfernoEdgeSword";
import { recipeJadeBlade } from "./recipeJadeBlade";
import { recipeKatana } from "./recipeKatana";
import { recipeLightBringerSword } from "./recipeLightBringerSword";
import { recipeMinotaurSword } from "./recipeMinotaurSword";
import { recipeMithrilSword } from "./recipeMithrilSword";
import { recipeMoonshadeSword } from "./recipeMoonshadeSword";
import { recipeNemesisSword } from "./recipeNemesisSword";
import { recipeOceanSaberSword } from "./recipeOceanSaberSword";
import { recipePhoenixSword } from "./recipePhoenixSword";
import { recipeRoyalGuardianSword } from "./recipeRoyalGuardianSword";
import { recipeThunderStrikeSword } from "./recipeThunderStrikeSword";
import { recipeTigerSword } from "./recipeTigerSword";
import { recipeTitaniumBroadsword } from "./recipeTitaniumBroadsword";
import { recipeVenomStrikeSword } from "./recipeVenomStrikeSword";
import { recipeVioletVenomSword } from "./recipeVioletVenomSword";
import { recipeWoodenSword } from "./recipeWoodenSword";
import { recipeZenBroadsword } from "./recipeZenBroadsword";

export const recipeSwordsIndex: Record<string, IUseWithCraftingRecipe[]> = {
  [SwordsBlueprint.ElvenSword]: [recipeElvenSword],
  [SwordsBlueprint.FireSword]: [recipeFireSword],
  [SwordsBlueprint.IceSword]: [recipeIceSword],
  [SwordsBlueprint.BasiliskSword]: [recipeBasiliskSword],
  [SwordsBlueprint.BroadSword]: [recipeBroadSword],
  [SwordsBlueprint.Katana]: [recipeKatana],
  [SwordsBlueprint.MithrilSword]: [recipeMithrilSword],
  [SwordsBlueprint.CorruptionSword]: [recipeCorruptionSword],
  [SwordsBlueprint.CopperBroadsword]: [recipeCopperBroadsword],
  [SwordsBlueprint.FrostguardSword]: [recipeFrostguardSword],
  [SwordsBlueprint.FrostbiteBlade]: [recipeFrostbiteBlade],
  [SwordsBlueprint.IronwoodTanto]: [recipeIronwoodTanto],
  [SwordsBlueprint.IceShardLongsword]: [recipeIceShardLongsword],
  [SwordsBlueprint.TungstenSword]: [recipeTungstenSword],
  [SwordsBlueprint.WoodenSword]: [recipeWoodenSword],
  [SwordsBlueprint.InfernoEdgeSword]: [recipeInfernoEdgeSword],
  [SwordsBlueprint.BronzeFuryBroadsword]: [recipeBronzeFuryBroadsword],
  [SwordsBlueprint.CenturionBroadsword]: [recipeCenturionBroadsword],
  [SwordsBlueprint.DiamondSword]: [recipeDiamondSword],
  [SwordsBlueprint.ElucidatorSword]: [recipeElucidatorSword],
  [SwordsBlueprint.EmeraldBroadsword]: [recipeEmeraldBroadsword],
  [SwordsBlueprint.GhostTalonSword]: [recipeGhostTalonSword],
  [SwordsBlueprint.GorgonBlade]: [recipeGorgonBlade],
  [SwordsBlueprint.HellfireEdgeSword]: [recipeHellfireEdgeSword],
  [SwordsBlueprint.JadeBlade]: [recipeJadeBlade],
  [SwordsBlueprint.LightBringerSword]: [recipeLightBringerSword],
  [SwordsBlueprint.MinotaurSword]: [recipeMinotaurSword],
  [SwordsBlueprint.MoonshadeSword]: [recipeMoonshadeSword],
  [SwordsBlueprint.NemesisSword]: [recipeNemesisSword],
  [SwordsBlueprint.OceanSaberSword]: [recipeOceanSaberSword],
  [SwordsBlueprint.PhoenixSword]: [recipePhoenixSword],
  [SwordsBlueprint.RoyalGuardianSword]: [recipeRoyalGuardianSword],
  [SwordsBlueprint.ThunderStrikeSword]: [recipeThunderStrikeSword],
  [SwordsBlueprint.TigerSword]: [recipeTigerSword],
  [SwordsBlueprint.TitaniumBroadsword]: [recipeTitaniumBroadsword],
  [SwordsBlueprint.VenomStrikeSword]: [recipeVenomStrikeSword],
  [SwordsBlueprint.VioletVenomSword]: [recipeVioletVenomSword],
  [SwordsBlueprint.ZenBroadsword]: [recipeZenBroadsword],
};
