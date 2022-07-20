import { ArmorsBlueprint } from "../../types/blueprintTypes";
import { itemBronzeArmor } from "./ItemBronzeArmor";
import { itemCoat } from "./ItemCoat";
import { itemIronArmor } from "./ItemIronArmor";
import { itemJacket } from "./ItemJacket";
import { itemLeatherJacket } from "./ItemLeatherJacket";
import { itemStuddedArmor } from "./ItemStuddedArmor";

export const armorsBlueprintsIndex = {
  [ArmorsBlueprint.Jacket]: itemJacket,
  [ArmorsBlueprint.Coat]: itemCoat,
  [ArmorsBlueprint.LeatherJacket]: itemLeatherJacket,
  [ArmorsBlueprint.StuddedArmor]: itemStuddedArmor,
  [ArmorsBlueprint.BronzeArmor]: itemBronzeArmor,
  [ArmorsBlueprint.IronArmor]: itemIronArmor,
};
