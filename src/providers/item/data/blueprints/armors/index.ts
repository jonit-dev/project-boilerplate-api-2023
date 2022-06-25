import { ArmorsBlueprint } from "../../types/blueprintTypes";
import { itemJacket } from "./ItemJacket";
import { itemCoat } from "./ItemCoat";
import { itemLeatherJacket } from "./ItemLeatherJacket";
import { itemStuddedArmor } from "./ItemStuddedArmor";

export const armorsBlueprintsIndex = {
  [ArmorsBlueprint.Jacket]: itemJacket,
  [ArmorsBlueprint.Coat]: itemCoat,
  [ArmorsBlueprint.LeatherJacket]: itemLeatherJacket,
  [ArmorsBlueprint.StuddedArmor]: itemStuddedArmor,
};
