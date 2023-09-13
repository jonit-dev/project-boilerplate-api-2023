import { IEquippableMeleeTier9WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SwordsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemLightBringerSword: IEquippableMeleeTier9WeaponBlueprint = {
  key: SwordsBlueprint.LightBringerSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/light-bringer-sword.png",
  name: "Light Bringer Sword",
  description: "A holy sword infused with celestial light, effective against undead.",
  attack: 70,
  defense: 67,
  tier: 9,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 165,
};
