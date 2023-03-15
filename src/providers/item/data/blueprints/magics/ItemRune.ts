import { IBaseItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { MagicsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemRune: IBaseItemBlueprint = {
  key: MagicsBlueprint.Rune,
  type: ItemType.Accessory,
  subType: ItemSubType.Magic,
  textureAtlas: "items",
  texturePath: "magics/rune.png",

  name: "Rune",
  description: "An ancient carved blank rune.",
  weight: 0.1,
  basePrice: 10,
  canSell: false,
};
