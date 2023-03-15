import { IEquippableWeaponBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { SpearsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemRoyalSpear: IEquippableWeaponBlueprint = {
  key: SpearsBlueprint.RoyalSpear,
  type: ItemType.Weapon,
  subType: ItemSubType.Spear,
  textureAtlas: "items",
  texturePath: "spears/royal-spear.png",
  name: "Royal Spear",
  description:
    "A regal spear fit for a king or queen, with a stunning and intricate design. It is imbued with powerful magical energy and is prized for its elegance and grace.",
  attack: 22,
  defense: 10,
  weight: 5,
  isTwoHanded: true,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 77,
};
