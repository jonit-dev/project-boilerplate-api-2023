import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableMeleeTier8WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { SwordsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemTitanTetherTachiSword: IEquippableMeleeTier8WeaponBlueprint = {
  key: SwordsBlueprint.TitanTetherTachiSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/titan-tether-tachi-sword.png",
  name: "Titan Tether Tachi Sword",
  description: "A relic from the age of Titans, its powerful swing can create seismic tremors on the battlefield.",
  attack: 63,
  defense: 58,
  tier: 8,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 148,
};
