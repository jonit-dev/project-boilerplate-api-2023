import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import { RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IEquippableRangedAmmoBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";

export const itemShockArrow: IEquippableRangedAmmoBlueprint = {
  key: RangedWeaponsBlueprint.ShockArrow,
  type: ItemType.Weapon,
  subType: ItemSubType.Ranged,
  textureAtlas: "items",
  texturePath: "ranged-weapons/shock-arrow.png",
  name: "Shock Arrow",
  description: "An arrow with sharp blades that can cause bleeding.",
  attack: 16,
  weight: 0.05,
  allowedEquipSlotType: [ItemSlotType.Accessory],
  maxStackSize: 100,
  basePrice: 2,
  entityEffects: [EntityEffectBlueprint.Bleeding],
  entityEffectChance: 50,
  canSell: false,
};
