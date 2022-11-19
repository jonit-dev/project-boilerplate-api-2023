import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { EffectableAttribute, ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { calculateItemUseEffectPoints } from "@providers/useWith/network/UseWithHelper";

import { AnimationEffectKeys, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IMagicItemUseWithEntity, MagicsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemHealRune: Partial<IMagicItemUseWithEntity> = {
  key: MagicsBlueprint.HealRune,
  type: ItemType.Accessory,
  subType: ItemSubType.Magic,
  textureAtlas: "items",
  texturePath: "magics/heal-rune.png",

  name: "Healing Rune",
  description: "An ancient healing rune.",
  weight: 0.5,
  allowedEquipSlotType: [ItemSlotType.Accessory, ItemSlotType.Inventory],
  basePrice: 20,

  power: 10,
  minMagicLevelRequired: 2,
  animationKey: AnimationEffectKeys.Blue,
  projectileAnimationKey: AnimationEffectKeys.LifeHeal,

  usableEffect: async (caster: ICharacter, target: ICharacter) => {
    const points = await calculateItemUseEffectPoints(MagicsBlueprint.HealRune, caster);

    ItemUsableEffect.apply(target, EffectableAttribute.Health, points);
  },
};
