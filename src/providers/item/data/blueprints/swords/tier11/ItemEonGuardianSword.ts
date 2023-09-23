import { IEquippableMeleeTier11WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SwordsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemEonGuardianSword: IEquippableMeleeTier11WeaponBlueprint = {
  key: SwordsBlueprint.EonGuardianSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/eon-guardian-sword.png",
  name: "Eon Guardian Sword",
  description:
    "orged from a dying stars heart by Warlord Thalos, this broadswords blue Aetherium core pulses with celestial might and ancient magic.",
  attack: 82,
  defense: 81,
  tier: 11,
  weight: 2,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 184,
};
