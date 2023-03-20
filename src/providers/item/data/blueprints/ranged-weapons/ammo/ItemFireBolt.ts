import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import { RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IEquippableRangedAmmoBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";

export const itemFireBolt: IEquippableRangedAmmoBlueprint = {
  key: RangedWeaponsBlueprint.FireBolt,
  type: ItemType.Weapon,
  subType: ItemSubType.Ranged,
  textureAtlas: "items",
  texturePath: "ranged-weapons/fire-bolt.png",
  name: "Fire Bolt",
  description:
    "An arrow imbued with fire magic. It is said to be able to ignite the air around it and to be capable of causing great damage when it hits its target.",
  attack: 18,
  weight: 0.012,
  allowedEquipSlotType: [ItemSlotType.Accessory],
  maxStackSize: 110,
  basePrice: 15,
  canSell: false,
  entityEffects: [EntityEffectBlueprint.Burning],
  entityEffectChance: 70,
};
