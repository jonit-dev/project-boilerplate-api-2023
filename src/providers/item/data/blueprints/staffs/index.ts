import { StaffsBlueprint } from "../../types/itemsBlueprintTypes";
import { itemAppendicesStaff } from "./ItemAppendicesStaff";
import { itemCorruptionStaff } from "./ItemCorruptionStaff";
import { itemFireStaff } from "./ItemFireStaff";

export const staffsBlueprintIndex = {
  [StaffsBlueprint.AppendicesStaff]: itemAppendicesStaff,
  [StaffsBlueprint.CorruptionStaff]: itemCorruptionStaff,
  [StaffsBlueprint.FireStaff]: itemFireStaff,
};
