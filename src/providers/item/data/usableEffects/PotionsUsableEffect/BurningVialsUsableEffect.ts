import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { EntityEffectUse } from "@providers/entityEffects/EntityEffectUse";
import { entityEffectBurning } from "@providers/entityEffects/data/blueprints/entityEffectBurning";
import { container } from "@providers/inversify/container";
import { EffectableAttribute, ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { calculateItemUseEffectPoints } from "@providers/useWith/libs/UseWithHelper";
import { MagicsBlueprint } from "@rpg-engine/shared";
import { IUsableEffectRune, UsableEffectsBlueprint } from "../types";

export const lightBurningVialsUsableEffect: IUsableEffectRune = {
  key: UsableEffectsBlueprint.LightBurningVialsUsableEffect,
  usableEffect: async (caster: ICharacter, target: ICharacter | INPC) => {
    const itemUsableEffect = container.get(ItemUsableEffect);

    const points = await calculateItemUseEffectPoints(MagicsBlueprint.FireRune, caster);

    await itemUsableEffect.apply(target, EffectableAttribute.Health, -2.5 * points);

    const entityEffectUse = container.get(EntityEffectUse);
    await entityEffectUse.applyEntityEffects(target, caster, entityEffectBurning);

    return points;
  },
  usableEffectDescription: "Deals a light fire damage to the target",
};

export const moderateBurningVialsUsableEffect: IUsableEffectRune = {
  key: UsableEffectsBlueprint.ModerateBurningVialsUsableEffect,
  usableEffect: async (caster: ICharacter, target: ICharacter | INPC) => {
    const itemUsableEffect = container.get(ItemUsableEffect);

    const points = await calculateItemUseEffectPoints(MagicsBlueprint.FireRune, caster);

    await itemUsableEffect.apply(target, EffectableAttribute.Health, -3.5 * points);

    const entityEffectUse = container.get(EntityEffectUse);
    await entityEffectUse.applyEntityEffects(target, caster, entityEffectBurning);

    return points;
  },
  usableEffectDescription: "Deals a moderate fire damage to the target",
};
