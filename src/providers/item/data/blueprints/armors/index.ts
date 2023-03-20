import { ArmorsBlueprint } from "../../types/itemsBlueprintTypes";

import { itemCoat } from "./tier0/ItemCoat";
import { itemFarmersJacket } from "./tier0/ItemFarmersJacket";
import { itemJacket } from "./tier0/ItemJacket";
import { itemLeatherJacket } from "./tier0/ItemLeatherJacket";
import { itemBlueCape } from "./tier1/ItemBlueCape";
import { itemIronArmor } from "./tier1/ItemIronArmor";
import { itemStuddedArmor } from "./tier1/ItemStuddedArmor";
import { itemBrassArmor } from "./tier2/ItemBrassArmor";
import { itemBronzeArmor } from "./tier2/ItemBronzeArmor";
import { itemIroncladArmor } from "./tier2/ItemIroncladArmor";
import { itemMysticCape } from "./tier2/ItemMysticCape";
import { itemGlacialArmor } from "./tier3/ItemGlacialArmor";
import { itemJadeEmperorsArmor } from "./tier3/ItemJadeEmperorsArmor";
import { itemKnightArmor } from "./tier3/ItemKnightArmor";
import { itemSorcerersCape } from "./tier3/ItemSorcerersCape";
import { itemCrownArmor } from "./tier4/ItemCrownArmor";
import { itemFalconsArmor } from "./tier4/ItemFalconsArmor";
import { itemPlateArmor } from "./tier4/ItemPlateArmor";
import { itemSpellcastersCape } from "./tier4/ItemSpellcastersCape";
import { itemBloodfireArmor } from "./tier5/ItemBloodfireArmor";
import { itemGoldenArmor } from "./tier5/ItemGoldenArmor";
import { itemMithrilArmor } from "./tier5/ItemMithrilArmor";

export const armorsBlueprintIndex = {
  [ArmorsBlueprint.BronzeArmor]: itemBronzeArmor,
  [ArmorsBlueprint.Coat]: itemCoat,
  [ArmorsBlueprint.GoldenArmor]: itemGoldenArmor,
  [ArmorsBlueprint.IronArmor]: itemIronArmor,
  [ArmorsBlueprint.Jacket]: itemJacket,
  [ArmorsBlueprint.LeatherJacket]: itemLeatherJacket,
  [ArmorsBlueprint.PlateArmor]: itemPlateArmor,
  [ArmorsBlueprint.StuddedArmor]: itemStuddedArmor,
  [ArmorsBlueprint.MithrilArmor]: itemMithrilArmor,
  [ArmorsBlueprint.BloodfireArmor]: itemBloodfireArmor,
  [ArmorsBlueprint.BlueCape]: itemBlueCape,
  [ArmorsBlueprint.BrassArmor]: itemBrassArmor,
  [ArmorsBlueprint.CrownArmor]: itemCrownArmor,
  [ArmorsBlueprint.FalconsArmor]: itemFalconsArmor,
  [ArmorsBlueprint.FarmersJacket]: itemFarmersJacket,
  [ArmorsBlueprint.GlacialArmor]: itemGlacialArmor,
  [ArmorsBlueprint.IroncladArmor]: itemIroncladArmor,
  [ArmorsBlueprint.JadeEmperorsArmor]: itemJadeEmperorsArmor,
  [ArmorsBlueprint.KnightArmor]: itemKnightArmor,
  [ArmorsBlueprint.MysticCape]: itemMysticCape,
  [ArmorsBlueprint.SorcerersCape]: itemSorcerersCape,
  [ArmorsBlueprint.SpellcastersCape]: itemSpellcastersCape,
};
