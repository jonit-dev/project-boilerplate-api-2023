import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { itemDarkRune } from "@providers/item/data/blueprints/magics/ItemDarkRune";
import { EffectableAttribute, ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { AnimationEffectKeys } from "@rpg-engine/shared";
import { calculateItemUseEffectPoints, IMagicItemUseWithEntity } from "../UseWithEntityBlueprints";

export const itemUseWithEntityPoisonRune: Partial<IMagicItemUseWithEntity> = {
  ...(itemDarkRune as IMagicItemUseWithEntity),

  power: 10,
  minMagicLevelRequired: 2,
  animationKey: AnimationEffectKeys.Green,
  projectileAnimationKey: AnimationEffectKeys.Poison,

  usableEffect: async (caster: ICharacter, target: ICharacter) => {
    const points = await calculateItemUseEffectPoints(itemUseWithEntityPoisonRune, caster);

    ItemUsableEffect.apply(target, EffectableAttribute.Health, -1 * points);
  },
};
