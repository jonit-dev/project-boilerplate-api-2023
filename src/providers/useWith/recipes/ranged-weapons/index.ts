import { RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { recipeArrow } from "./recipeArrow";
import { recipeBloodseekerBow } from "./recipeBloodseekerBow";
import { recipeBolt } from "./recipeBolt";
import { recipeBow } from "./recipeBow";
import { recipeChordedCataclysmBow } from "./recipeChordedCataclysmBow";
import { recipeCorruptionBolt } from "./recipeCorruptionBolt";
import { recipeCrossBow } from "./recipeCrossBow";
import { recipeCrystallineArrow } from "./recipeCrystallineArrow";
import { recipeCursedBolt } from "./recipeCursedBolt";
import { recipeDragonBow } from "./recipeDragonBow";
import { recipeDragonWingBow } from "./recipeDragonWingBow";
import { recipeEbonyLongbow } from "./recipeEbonyLongbow";
import { recipeElmReflexBow } from "./recipeElmReflexBow";
import { recipeElvenBolt } from "./recipeElvenBolt";
import { recipeFireBolt } from "./recipeFireBolt";
import { recipeGaleGuardianGripCrossbow } from "./recipeGaleGuardianGripCrossbow";
import { recipeGoldenArrow } from "./recipeGoldenArrow";
import { recipeGossamerBolt } from "./recipeGossamerBolt";
import { recipeHadesBow } from "./recipeHadesBow";
import { recipeIronArrow } from "./recipeIronArrow";
import { recipeIronBarkBow } from "./recipeIronBarkBow";
import { recipeLightingCrossbow } from "./recipeLightingCrossbow";
import { recipeMysticMeadowArrow } from "./recipeMysticMeadowArrow";
import { recipeParallelPrecisionBow } from "./recipeParallelPrecisionBow";
import { recipePhoenixBow } from "./recipePhoenixBow";
import { recipePlasmaPierceArrow } from "./recipePlasmaPierceArrow";
import { recipePoisonArrow } from "./recipePoisonArrow";
import { recipeRedwoodLongbow } from "./recipeRedwoodLongbow";
import { recipeRoyalBow } from "./recipeRoyalBow";
import { recipeRuneBow } from "./recipeRuneBow";
import { recipeShockArrow } from "./recipeShockArrow";
import { recipeSilvermoonArrow } from "./recipeSilvermoonArrow";
import { recipeStarsHooterBow } from "./recipeStarsHooterBow";
import { recipeStoneBreakerBow } from "./recipeStoneBreakerBow";
import { recipeStormBow } from "./recipeStormBow";
import { recipeSunstoneBow } from "./recipeSunstoneBow";
import { recipeUmbralBow } from "./recipeUmbralBow";
import { recipeValkyriesBow } from "./recipeValkyriesBow";
import { recipeZephyrusBow } from "./recipeZephyrusBow";

export const recipeRangedIndex: Record<string, IUseWithCraftingRecipe[]> = {
  [RangedWeaponsBlueprint.Arrow]: [recipeArrow],
  [RangedWeaponsBlueprint.IronArrow]: [recipeIronArrow],
  [RangedWeaponsBlueprint.PoisonArrow]: [recipePoisonArrow],
  [RangedWeaponsBlueprint.Bolt]: [recipeBolt],
  [RangedWeaponsBlueprint.CorruptionBolt]: [recipeCorruptionBolt],
  [RangedWeaponsBlueprint.FireBolt]: [recipeFireBolt],
  [RangedWeaponsBlueprint.ElvenBolt]: [recipeElvenBolt],
  [RangedWeaponsBlueprint.Bow]: [recipeBow],
  [RangedWeaponsBlueprint.DragonBow]: [recipeDragonBow],
  [RangedWeaponsBlueprint.HadesBow]: [recipeHadesBow],
  [RangedWeaponsBlueprint.Crossbow]: [recipeCrossBow],
  [RangedWeaponsBlueprint.GoldenArrow]: [recipeGoldenArrow],
  [RangedWeaponsBlueprint.LightningCrossbow]: [recipeLightingCrossbow],
  [RangedWeaponsBlueprint.PhoenixBow]: [recipePhoenixBow],
  [RangedWeaponsBlueprint.RuneBow]: [recipeRuneBow],
  [RangedWeaponsBlueprint.ShockArrow]: [recipeShockArrow],
  [RangedWeaponsBlueprint.StormBow]: [recipeStormBow],
  [RangedWeaponsBlueprint.SunstoneBow]: [recipeSunstoneBow],
  [RangedWeaponsBlueprint.ValkyriesBow]: [recipeValkyriesBow],
  [RangedWeaponsBlueprint.ZephyrusBow]: [recipeZephyrusBow],
  [RangedWeaponsBlueprint.RoyalBow]: [recipeRoyalBow],
  [RangedWeaponsBlueprint.EbonyLongbow]: [recipeEbonyLongbow],
  [RangedWeaponsBlueprint.ElmReflexBow]: [recipeElmReflexBow],
  [RangedWeaponsBlueprint.RedwoodLongbow]: [recipeRedwoodLongbow],
  [RangedWeaponsBlueprint.BloodseekerBow]: [recipeBloodseekerBow],
  [RangedWeaponsBlueprint.DragonWingBow]: [recipeDragonWingBow],
  [RangedWeaponsBlueprint.IronBarkBow]: [recipeIronBarkBow],
  [RangedWeaponsBlueprint.StarsHooterBow]: [recipeStarsHooterBow],
  [RangedWeaponsBlueprint.StoneBreakerBow]: [recipeStoneBreakerBow],
  [RangedWeaponsBlueprint.UmbralBow]: [recipeUmbralBow],
  [RangedWeaponsBlueprint.CrystallineArrow]: [recipeCrystallineArrow],
  [RangedWeaponsBlueprint.SilvermoonArrow]: [recipeSilvermoonArrow],
  [RangedWeaponsBlueprint.CursedBolt]: [recipeCursedBolt],
  [RangedWeaponsBlueprint.GossamerBolt]: [recipeGossamerBolt],
  [RangedWeaponsBlueprint.ChordedCataclysmBow]: [recipeChordedCataclysmBow],
  [RangedWeaponsBlueprint.GaleGuardianGripCrossbow]: [recipeGaleGuardianGripCrossbow],
  [RangedWeaponsBlueprint.ParallelPrecisionBow]: [recipeParallelPrecisionBow],
  [RangedWeaponsBlueprint.MysticMeadowArrow]: [recipeMysticMeadowArrow],
  [RangedWeaponsBlueprint.PlasmaPierceArrow]: [recipePlasmaPierceArrow],
};
