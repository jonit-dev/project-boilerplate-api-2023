import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { container } from "@providers/inversify/container";
import { EffectableAttribute, ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { SpellCalculator } from "@providers/spells/data/abstractions/SpellCalculator";
import { BasicAttribute } from "@rpg-engine/shared";
import { IUsableEffectRune, UsableEffectsBlueprint } from "../types";

export const healRuneUsableEffect: IUsableEffectRune = {
  key: UsableEffectsBlueprint.HealRuneUsableEffect,
  usableEffect: async (caster: ICharacter, target: ICharacter | INPC) => {
    const itemUsableEffect = container.get(ItemUsableEffect);

    const spellCalculator = container.get(SpellCalculator);

    const percentage = await spellCalculator.calculateBuffBasedOnSkillLevel(caster, BasicAttribute.Magic, {
      min: 50,
      max: 100,
    });

    const totalAmount = (target.maxHealth * percentage) / 100;

    itemUsableEffect.apply(target, EffectableAttribute.Health, totalAmount);
  },

  usableEffectDescription: "Restores 50-100% of health, based on Magic skill level",
};
