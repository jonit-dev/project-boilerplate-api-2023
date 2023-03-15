import { IEquippableWeaponBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { AxesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemGreataxe: IEquippableWeaponBlueprint = {
  key: AxesBlueprint.Greataxe,
  type: ItemType.Weapon,
  subType: ItemSubType.Axe,
  textureAtlas: "items",
  texturePath: "axes/greataxe.png",
  name: "Greataxe",
  description:
    "A large, two-handed axe with a broad head and a long handle. It is designed for heavy chopping and slicing and is typically wielded by strong, heavily-armored warriors.",
  attack: 30,
  defense: 5,
  weight: 2.1,
  isTwoHanded: true,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 57,
};
