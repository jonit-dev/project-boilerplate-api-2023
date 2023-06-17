import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import { IEquippableRangedAmmoBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { RangedWeaponsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemFrostArrow: IEquippableRangedAmmoBlueprint = {
  key: RangedWeaponsBlueprint.FrostArrow,
  type: ItemType.Weapon,
  subType: ItemSubType.Ranged,
  textureAtlas: "items",
  texturePath: "ranged-weapons/frost-arrow.png",
  name: "Frost Arrow",
  description: "An arrow infused with icy energy, chilling enemies on impact.",
  attack: 19,
  weight: 0.1,
  allowedEquipSlotType: [ItemSlotType.Accessory],
  maxStackSize: 100,
  basePrice: 10,
  entityEffects: [EntityEffectBlueprint.Freezing],
  entityEffectChance: 80,
  canSell: false,
};
