import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableMeleeTier7WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { SwordsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemYggdrasilBroadsword: IEquippableMeleeTier7WeaponBlueprint = {
  key: SwordsBlueprint.YggdrasilBroadsword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/yggdrasil-broadsword.png",
  name: "Yggdrasil Broadsword",
  description:
    "Hewn from the massive trunk of Yggdrasil, this broadsword is as steadfast as the tree itself, offering unyielding strength in battle.",
  attack: 54,
  defense: 51,
  tier: 7,
  weight: 1.2,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 138,
};
