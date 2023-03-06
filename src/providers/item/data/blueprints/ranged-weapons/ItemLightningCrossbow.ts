import { IItem } from "@entities/ModuleInventory/ItemModel";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { RangedWeaponsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemLightningCrossbow: Partial<IItem> = {
  key: RangedWeaponsBlueprint.LightningCrossbow,
  type: ItemType.Weapon,
  rangeType: EntityAttackType.Ranged,
  subType: ItemSubType.Ranged,
  textureAtlas: "items",
  texturePath: "ranged-weapons/lightning-crossbow.png",
  name: "Lightning Crossbow",
  description: "A crossbow that fires bolts of lightning, dealing heavy damage to enemies weak to lightning.",
  attack: 20,
  weight: 5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  maxRange: 7,
  requiredAmmoKeys: [
    RangedWeaponsBlueprint.Bolt,
    RangedWeaponsBlueprint.FireBolt,
    RangedWeaponsBlueprint.CorruptionBolt,
    RangedWeaponsBlueprint.ElvenBolt,
  ],
  isTwoHanded: true,
  basePrice: 95,
};
