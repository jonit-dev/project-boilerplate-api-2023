import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { EffectableAttribute, ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { calculateItemUseEffectPoints } from "@providers/useWith/network/UseWithHelper";

import { AnimationEffectKeys, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IMagicItemUseWithEntity, MagicsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemFireRune: Partial<IMagicItemUseWithEntity> = {
  key: MagicsBlueprint.FireRune,
  type: ItemType.Accessory,
  subType: ItemSubType.Magic,
  textureAtlas: "items",
  texturePath: "magics/fire-rune.png",
  name: "Fire Rune",
  description: "An ancient fire rune.",
  weight: 0.5,
  allowedEquipSlotType: [ItemSlotType.Accessory, ItemSlotType.Inventory],
  basePrice: 20,

  power: 10,
  minMagicLevelRequired: 2,
  animationKey: AnimationEffectKeys.FireBall,
  projectileAnimationKey: AnimationEffectKeys.Hit,

  usableEffect: async (caster: ICharacter, target: ICharacter) => {
    const points = await calculateItemUseEffectPoints(MagicsBlueprint.FireRune, caster);

    ItemUsableEffect.apply(target, EffectableAttribute.Health, -1 * points);
  },
};
