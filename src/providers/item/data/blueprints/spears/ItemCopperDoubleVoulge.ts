import { EntityAttackType, IEquippableWeaponBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SpearsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemCopperDoubleVoulge: IEquippableWeaponBlueprint = {
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
  attack: 13,
  defense: 5,
  rangeType: EntityAttackType.Melee,
  basePrice: 51,
};
