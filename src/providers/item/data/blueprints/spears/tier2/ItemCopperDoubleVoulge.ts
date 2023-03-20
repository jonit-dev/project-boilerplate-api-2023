import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableTwoHandedTier2WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { SpearsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemCopperDoubleVoulge: IEquippableTwoHandedTier2WeaponBlueprint = {
  key: SpearsBlueprint.CopperDoubleVoulge,
  type: ItemType.Weapon,
  subType: ItemSubType.Spear,
  textureAtlas: "items",
  texturePath: "spears/copper-double-voulge.png",
  name: "Copper Double Voulge",
  description:
    "The Copper Double Voulge is a two-handed polearm with a long handle and two long blades made of solid copper at the ends. The blades have a dull, reddish-brown hue, but are still razor-sharp, able to slice through flesh and bone with ease.",
  weight: 2.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 36,
  defense: 20,
  tier: 2,
  isTwoHanded: true,
  rangeType: EntityAttackType.Melee,
  basePrice: 51,
};
