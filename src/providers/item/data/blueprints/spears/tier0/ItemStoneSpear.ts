import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { IEquippableTwoHandedTier0WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { SpearsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemStoneSpear: IEquippableTwoHandedTier0WeaponBlueprint = {
  key: SpearsBlueprint.StoneSpear,
  type: ItemType.Weapon,
  subType: ItemSubType.Spear,
  textureAtlas: "items",
  texturePath: "spears/stone-spear.png",
  name: "Stone Spear",
  description:
    "A primitive melee weapon made of a wooden stick and a pointed head made of stone. It is a basic but effective weapon that can be used for thrusting and stabbing attacks.",
  attack: 16,
  defense: 8,
  tier: 0,
  weight: 3,
  isTwoHanded: true,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,

  basePrice: 40,
};
