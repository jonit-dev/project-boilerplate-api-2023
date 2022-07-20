import { ArmorsBlueprint } from "../../types/itemsBlueprintTypes";
import { itemCoat } from "./ItemCoat";
import { itemJacket } from "./ItemJacket";
import { itemLeatherJacket } from "./ItemLeatherJacket";
import { itemStuddedArmor } from "./ItemStuddedArmor";

export const armorsBlueprintsIndex = {
  [ArmorsBlueprint.Jacket]: itemJacket,
  [ArmorsBlueprint.Coat]: itemCoat,
  [ArmorsBlueprint.LeatherJacket]: itemLeatherJacket,
  [ArmorsBlueprint.StuddedArmor]: itemStuddedArmor,
};
