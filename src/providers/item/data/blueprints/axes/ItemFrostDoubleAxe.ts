import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import { IEquippableWeaponBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { AxesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemFrostDoubleAxe: IEquippableWeaponBlueprint = {
  key: AxesBlueprint.FrostDoubleAxe,
  type: ItemType.Weapon,
  subType: ItemSubType.Axe,
  textureAtlas: "items",
  texturePath: "axes/frost-double-axe.png",

  name: "Frost Double Axe",
  description: "A large master-crafted weapon with a frosted blade.",
  attack: 25,
  defense: 6,
  weight: 1.8,
  isTwoHanded: true,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 60,
  entityEffects: [EntityEffectBlueprint.Freezing],
  entityEffectChance: 90,
};
