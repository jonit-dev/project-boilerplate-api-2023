import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { RangedWeaponsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemOrcishBow: Partial<IItem> = {
  key: RangedWeaponsBlueprint.OrcishBow,
  type: ItemType.Weapon,
  subType: ItemSubType.Ranged,
  rangeType: EntityAttackType.Ranged,
  textureAtlas: "items",
  texturePath: "ranged-weapons/orcish-bow.png",
  name: "Orcish Bow",
  description:
    "A bow with some decorative tooths and very long string. It is used by orcs for hunting or during battles.",
  attack: 6,
  defense: 4,
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  maxRange: 10,
  requiredAmmoKeys: [RangedWeaponsBlueprint.Arrow, RangedWeaponsBlueprint.IronArrow],
  isTwoHanded: true,
  basePrice: 81,
};
