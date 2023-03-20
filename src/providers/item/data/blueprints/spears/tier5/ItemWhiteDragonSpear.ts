import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableTwoHandedTier5WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { SpearsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemWhiteDragonSpear: IEquippableTwoHandedTier5WeaponBlueprint = {
  key: SpearsBlueprint.WhiteDragonSpear,
  type: ItemType.Weapon,
  subType: ItemSubType.Spear,
  textureAtlas: "items",
  texturePath: "spears/white-dragon-spear.png",
  name: "White Dragon Spear",
  description:
    "A white spear adorned with stars and other celestial decorations, with a sharp, pointed tip imbued with celestial power.",
  weight: 5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 90,
  defense: 43,
  tier: 5,
  isTwoHanded: true,
  rangeType: EntityAttackType.Melee,
  basePrice: 65,
};
