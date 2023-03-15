import { IEquippableWeaponBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { SwordsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemKatana: IEquippableWeaponBlueprint = {
  key: SwordsBlueprint.Katana,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/katana.png",

  name: "Katana",
  description:
    "A traditional Japanese sword with a curved, single-edged blade, known for its sharpness and versatility.",
  attack: 16,
  defense: 7,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 60,
};
