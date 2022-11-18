import { calculateItemUseEffectPoints, IItemUseWithEntity } from "../UseWithEntityBlueprints";
import { itemDarkRune } from "@providers/item/data/blueprints/magics/ItemDarkRune";
import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { EffectableAttribute, ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { AnimationEffectKeys } from "@rpg-engine/shared";

export const itemUseWithEntityHealRune: Partial<IItemUseWithEntity> = {
  ...(itemDarkRune as IItemUseWithEntity),

  power: 10,
  minMagicLevelRequired: 2,

  animationKey: AnimationEffectKeys.Blue,
  projectileAnimationKey: AnimationEffectKeys.LifeHeal,

  usableEffect: async (caster: ICharacter, target: ICharacter) => {
    const points = await calculateItemUseEffectPoints(itemUseWithEntityHealRune, caster);

    ItemUsableEffect.apply(target, EffectableAttribute.Health, points);
  },
};
