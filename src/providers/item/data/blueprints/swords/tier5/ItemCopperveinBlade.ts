import { IEquippableMeleeTier5WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SwordsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemCopperveinBlade: IEquippableMeleeTier5WeaponBlueprint = {
  key: SwordsBlueprint.CopperveinBlade,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/coppervein-blade.png",
  name: "Coppervein Blade",
  description:
    "A mixture of copper and tin imbues this bronze blade with the power to amplify magical energies, boosting the effectiveness of spells.",
  attack: 43,
  defense: 38,
  tier: 5,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 125,
};
