import { ArmorsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { recipeBloodfireArmor } from "./recipeBloodfireArmor";
import { recipeBlueCape } from "./recipeBlueCape";
import { recipeBrassArmor } from "./recipeBrassArmor";
import { recipeBronzeArmor } from "./recipeBronzeArmor";
import { recipeCrownArmor } from "./recipeCrownArmor";
import { recipeFalconsArmor } from "./recipeFalconsArmor";
import { recipeGlacialArmor } from "./recipeGlacialArmor";
import { recipeIronArmor } from "./recipeIronArmor";
import { recipeIroncladArmor } from "./recipeIroncladArmor";
import { recipeKnightArmor } from "./recipeKnightArmor";
import { recipeMysticCape } from "./recipeMysticCape";
import { recipePlateArmor } from "./recipePlateArmor";
import { recipeSorcerersCape } from "./recipeSorcerersCape";
import { recipeSpellcastersCape } from "./recipeSpellCastersCape";
import { recipeStuddedArmor } from "./recipeStuddedArmor";
import { recipeCoat } from "./recipeCoat";
import { recipeJacket } from "./recipeJacket";
import { recipeFarmersJacket } from "./recipeFarmersJacket";
import { recipeLeatherJacket } from "./recipeLeatherJacket";

export const recipeArmorsIndex: Record<string, IUseWithCraftingRecipe[]> = {
  [ArmorsBlueprint.StuddedArmor]: [recipeStuddedArmor],
  [ArmorsBlueprint.IronArmor]: [recipeIronArmor],
  [ArmorsBlueprint.BronzeArmor]: [recipeBronzeArmor],
  [ArmorsBlueprint.PlateArmor]: [recipePlateArmor],
  [ArmorsBlueprint.BloodfireArmor]: [recipeBloodfireArmor],
  [ArmorsBlueprint.BlueCape]: [recipeBlueCape],
  [ArmorsBlueprint.BrassArmor]: [recipeBrassArmor],
  [ArmorsBlueprint.CrownArmor]: [recipeCrownArmor],
  [ArmorsBlueprint.FalconsArmor]: [recipeFalconsArmor],
  [ArmorsBlueprint.GlacialArmor]: [recipeGlacialArmor],
  [ArmorsBlueprint.IroncladArmor]: [recipeIroncladArmor],
  [ArmorsBlueprint.KnightArmor]: [recipeKnightArmor],
  [ArmorsBlueprint.MysticCape]: [recipeMysticCape],
  [ArmorsBlueprint.SorcerersCape]: [recipeSorcerersCape],
  [ArmorsBlueprint.SpellcastersCape]: [recipeSpellcastersCape],
  [ArmorsBlueprint.Coat]: [recipeCoat],
  [ArmorsBlueprint.Jacket]: [recipeJacket],
  [ArmorsBlueprint.FarmersJacket]: [recipeFarmersJacket],
  [ArmorsBlueprint.LeatherJacket]: [recipeLeatherJacket],
};
