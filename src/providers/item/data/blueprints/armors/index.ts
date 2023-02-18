import { ArmorsBlueprint } from "../../types/itemsBlueprintTypes";
import { itemBronzeArmor } from "./ItemBronzeArmor";
import { itemCoat } from "./ItemCoat";
import { itemGoldenArmor } from "./ItemGoldenArmor";
import { itemIronArmor } from "./ItemIronArmor";
import { itemJacket } from "./ItemJacket";
import { itemLeatherJacket } from "./ItemLeatherJacket";
import { itemMithrilArmor } from "./ItemMithrilArmor";
import { itemPlateArmor } from "./ItemPlateArmor";
import { itemStuddedArmor } from "./ItemStuddedArmor";

export const armorsBlueprintsIndex = {
  [ArmorsBlueprint.BronzeArmor]: itemBronzeArmor,
  [ArmorsBlueprint.Coat]: itemCoat,
  [ArmorsBlueprint.GoldenArmor]: itemGoldenArmor,
  [ArmorsBlueprint.IronArmor]: itemIronArmor,
  [ArmorsBlueprint.Jacket]: itemJacket,
  [ArmorsBlueprint.LeatherJacket]: itemLeatherJacket,
  [ArmorsBlueprint.PlateArmor]: itemPlateArmor,
  [ArmorsBlueprint.StuddedArmor]: itemStuddedArmor,
  [ArmorsBlueprint.MithrilArmor]: itemMithrilArmor,
};
