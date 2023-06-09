import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableMeleeTier3WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { MacesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemRusticFlail: IEquippableMeleeTier3WeaponBlueprint = {
  key: MacesBlueprint.RusticFlail,
  type: ItemType.Weapon,
  subType: ItemSubType.Mace,
  textureAtlas: "items",
  texturePath: "maces/rustic-flail.png",
  name: "Rustic Flail",
  description: "A mace with a brown wooden handle and a round, spiky head made of rusted metal.",
  weight: 2,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 26,
  defense: 15,
  tier: 3,
  rangeType: EntityAttackType.Melee,
  basePrice: 62,
};
