import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { EntityEffectUse } from "@providers/entityEffects/EntityEffectUse";
import { entityEffectPoison } from "@providers/entityEffects/data/blueprints/entityEffectPoison";
import { container } from "@providers/inversify/container";
import { EffectableAttribute, ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { calculateItemUseEffectPoints } from "@providers/useWith/libs/UseWithHelper";
import { MagicsBlueprint } from "@rpg-engine/shared";
import { IUsableEffectRune, UsableEffectsBlueprint } from "../types";

export const lightPoisonVialUsableEffect: IUsableEffectRune = {
  key: UsableEffectsBlueprint.LightPoisonVialUsableEffect,
  usableEffect: async (caster: ICharacter, target: ICharacter | INPC) => {
    const itemUsableEffect = container.get(ItemUsableEffect);

    const points = await calculateItemUseEffectPoints(MagicsBlueprint.PoisonRune, caster);

    itemUsableEffect.apply(target, EffectableAttribute.Health, -2 * points);

    const entityEffectUse = container.get(EntityEffectUse);
    await entityEffectUse.applyEntityEffects(target, caster, entityEffectPoison);

    return points;
  },
  usableEffectDescription: "Deals a light poison damage to the target",
};

export const moderatePoisonVialUsableEffect: IUsableEffectRune = {
  key: UsableEffectsBlueprint.ModeratePoisonVialUsableEffect,
  usableEffect: async (caster: ICharacter, target: ICharacter | INPC) => {
    const itemUsableEffect = container.get(ItemUsableEffect);

    const points = await calculateItemUseEffectPoints(MagicsBlueprint.PoisonRune, caster);

    itemUsableEffect.apply(target, EffectableAttribute.Health, -2.5 * points);

    const entityEffectUse = container.get(EntityEffectUse);
    await entityEffectUse.applyEntityEffects(target, caster, entityEffectPoison);

    return points;
  },
  usableEffectDescription: "Deals a moderate poison damage to the target",
};

export const strongPoisonVialUsableEffect: IUsableEffectRune = {
  key: UsableEffectsBlueprint.StrongPoisonVialUsableEffect,
  usableEffect: async (caster: ICharacter, target: ICharacter | INPC) => {
    const itemUsableEffect = container.get(ItemUsableEffect);

    const points = await calculateItemUseEffectPoints(MagicsBlueprint.PoisonRune, caster);

    itemUsableEffect.apply(target, EffectableAttribute.Health, -3 * points);

    const entityEffectUse = container.get(EntityEffectUse);
    await entityEffectUse.applyEntityEffects(target, caster, entityEffectPoison);

    return points;
  },
  usableEffectDescription: "Deals poison damage to the target",
};
