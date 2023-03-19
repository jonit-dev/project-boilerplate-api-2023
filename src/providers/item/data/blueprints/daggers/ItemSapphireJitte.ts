import { EntityAttackType, IEquippableWeaponBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { DaggersBlueprint } from "../../types/itemsBlueprintTypes";

export const itemSapphireJitte: IEquippableWeaponBlueprint = {
  key: DaggersBlueprint.SapphireJitte,
  type: ItemType.Weapon,
  subType: ItemSubType.Dagger,
  textureAtlas: "items",
  texturePath: "daggers/sapphire-jitte.png",
  name: "Sapphire Jitte",
  description:
    "The Sapphire Jitte is a rare and beautiful weapon made entirely of shimmering blue sapphire. Its long shaft features intricate designs that reflect light. The Jitte is a weapon favored by those who value style and grace in combat.",
  weight: 1.1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 18,
  defense: 10,
  rangeType: EntityAttackType.Melee,
  basePrice: 69,
};
