import { ContainersBlueprint } from "../../types/itemsBlueprintTypes";
import { itemBackpack } from "./ItemBackpack";
import { itemBag } from "./ItemBag";

export const containersBlueprintIndex = {
  [ContainersBlueprint.Bag]: itemBag,
  [ContainersBlueprint.Backpack]: itemBackpack,
};
