import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import { RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IEquippableRangedAmmoBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";

export const itemMysticMeadowArrow: IEquippableRangedAmmoBlueprint = {
  key: RangedWeaponsBlueprint.MysticMeadowArrow,
  type: ItemType.Weapon,
  subType: ItemSubType.Ranged,
  textureAtlas: "items",
  texturePath: "ranged-weapons/mystic-meadow-arrow.png",
  name: "Mystic Meadow Arrow",
  description: "Infused with the essence of ancient forests, this arrow can root its target to the ground momentarily.",
  attack: 30,
  weight: 0.1,
  allowedEquipSlotType: [ItemSlotType.Accessory],
  maxStackSize: 999,
  basePrice: 20,
  entityEffects: [EntityEffectBlueprint.VineGrasp],
  entityEffectChance: 70,
  canSell: false,
};
