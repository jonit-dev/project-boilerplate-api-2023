import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { HitTarget } from "@providers/battle/HitTarget";
import { EntityEffectUse } from "@providers/entityEffects/EntityEffectUse";
import { entityEffectBleeding } from "@providers/entityEffects/data/blueprints/entityEffectBleeding";
import { container } from "@providers/inversify/container";
import {
  AnimationEffectKeys,
  BasicAttribute,
  CharacterClass,
  ISpell,
  RangeTypes,
  SpellCastingType,
  SpellsBlueprint,
} from "@rpg-engine/shared";

import { SpellCalculator } from "../../abstractions/SpellCalculator";

export const spellBleedingEdge: Partial<ISpell> = {
  key: SpellsBlueprint.BleedingEdge,
  name: "Bleeding Edge",
  description:
    "Unleash the Crimson Strike, dealing immediate damage to your opponent while inflicting a bleeding effect",
  castingType: SpellCastingType.RangedCasting,
  magicWords: "ithilgil urui",
  manaCost: 50,
  minLevelRequired: 20,
  minMagicLevelRequired: 15,
  cooldown: 60,
  castingAnimationKey: AnimationEffectKeys.SkillLevelUp,
  targetHitAnimationKey: AnimationEffectKeys.Hit,
  projectileAnimationKey: AnimationEffectKeys.Shuriken,
  maxDistanceGrid: RangeTypes.Medium,
  characterClass: [CharacterClass.Warrior],

  usableEffect: async (character: ICharacter, target: ICharacter | INPC) => {
    const entityEffectUse = container.get(EntityEffectUse);
    const hitTarget = container.get(HitTarget);
    const spellCalculator = container.get(SpellCalculator);

    const skillDamage = await spellCalculator.spellDamageCalculator(character, BasicAttribute.Strength, {
      level: true,
      minLevelMultiplier: 0.2,
      maxLevelMultiplier: 0.8,
    });

    await hitTarget.hit(character, target, true, skillDamage, true);

    await entityEffectUse.applyEntityEffects(target, character, entityEffectBleeding);

    return true;
  },
};
