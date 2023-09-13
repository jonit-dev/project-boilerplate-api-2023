import { IEquippableMeleeTier7WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { HammersBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemSledgeHammer: IEquippableMeleeTier7WeaponBlueprint = {
  key: HammersBlueprint.SledgeHammer,
  type: ItemType.Weapon,
  subType: ItemSubType.Mace,
  textureAtlas: "items",
  texturePath: "hammers/sledge-hammer.png",
  name: "Sledge Hammer",
  description: "A heavy-duty hammer designed for maximum impact, often used for smashing obstacles or enemies.",
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 54,
  defense: 28,
  tier: 7,
  rangeType: EntityAttackType.Melee,
};
