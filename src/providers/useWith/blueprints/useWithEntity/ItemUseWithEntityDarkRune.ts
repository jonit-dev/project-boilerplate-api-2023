import { calculateItemUseEffectPoints, IItemUseWithEntity } from "../UseWithEntityBlueprints";
import { itemDarkRune } from "@providers/item/data/blueprints/magics/ItemDarkRune";
import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { EffectableAttribute, ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";

export const itemUseWithEntityDarkRune: Partial<IItemUseWithEntity> = {
  ...(itemDarkRune as IItemUseWithEntity),
  power: 10,
  animationKey: "",
  projectileAnimationKey: "",
  usableEffect: async (caster: ICharacter, target: ICharacter) => {
    const points = await calculateItemUseEffectPoints(itemUseWithEntityDarkRune, caster);

    ItemUsableEffect.apply(target, EffectableAttribute.Mana, points);
  },
};
