import { IEquippableMeleeTier6WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SwordsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemTigerSword: IEquippableMeleeTier6WeaponBlueprint = {
  key: SwordsBlueprint.TigerSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/tiger-sword.png",
  name: "Tiger Sword ",
  description: "A fiercely designed blade adorned with tiger motifs, symbolizing courage and agility.",
  attack: 50,
  defense: 45,
  tier: 6,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 135,
};
