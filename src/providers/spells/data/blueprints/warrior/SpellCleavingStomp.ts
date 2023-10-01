import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { HitTarget } from "@providers/battle/HitTarget";
import { SPELL_AREA_DIAMOND_BLAST_RADIUS } from "@providers/constants/SpellConstants";
import { characterBuffActivator, container } from "@providers/inversify/container";
import { SpellArea } from "@providers/spells/area-spells/SpellArea";
import {
  AnimationEffectKeys,
  BasicAttribute,
  CharacterAttributes,
  CharacterBuffDurationType,
  CharacterBuffType,
  CharacterClass,
  ISpell,
  SpellCastingType,
  SpellsBlueprint,
} from "@rpg-engine/shared";
import { SpellCalculator } from "../../abstractions/SpellCalculator";

export const spellCleavingStomp: Partial<ISpell> = {
  key: SpellsBlueprint.CleavingStomp,
  name: "Cleaving Stomp",
  description: "Unleash a powerful shockwave by stomping the ground, doing damage and slow down nearby enemies.",
  castingType: SpellCastingType.SelfCasting,
  magicWords: "rista nwalma",
  manaCost: 50,
  minLevelRequired: 15,
  minMagicLevelRequired: 10,
  cooldown: 30,
  castingAnimationKey: AnimationEffectKeys.SkillLevelUp,
  targetHitAnimationKey: AnimationEffectKeys.HitEnergy,
  characterClass: [CharacterClass.Warrior],

  usableEffect: async (caster: ICharacter, target: ICharacter | INPC) => {
    const spellArea = container.get(SpellArea);
    const spellCalculator = container.get(SpellCalculator);

    const skillDamage =
      (await spellCalculator.spellDamageCalculator(caster, BasicAttribute.Strength, {
        level: true,
        minLevelMultiplier: 0.5,
        maxLevelMultiplier: 0.8,
      })) / 3;

    await spellArea.cast(caster, caster, skillDamage, {
      effectAnimationKey: AnimationEffectKeys.HitEnergy,
      spellAreaGrid: SPELL_AREA_DIAMOND_BLAST_RADIUS,
      customFn: async (target: ICharacter | INPC, intensity: number) => {
        const hitTarget = container.get(HitTarget);

        await hitTarget.hit(caster, target, true, skillDamage + intensity, true);

        if (target.type === "Character") {
          const timeout = await spellCalculator.calculateBasedOnSkillLevel(caster, BasicAttribute.Strength, {
            min: 30,
            max: 60,
          });

          const debuffPercentage = await spellCalculator.calculateBasedOnSkillLevel(caster, BasicAttribute.Strength, {
            min: 20,
            max: 35,
          });

          await characterBuffActivator.enableTemporaryBuff(target as ICharacter, {
            type: CharacterBuffType.CharacterAttribute,
            trait: CharacterAttributes.Speed,
            buffPercentage: -debuffPercentage,
            durationSeconds: timeout,
            durationType: CharacterBuffDurationType.Temporary,
            options: {
              messages: {
                activation: `Your speed is reduced! (-${debuffPercentage}%)`,
                deactivation: "Your speed is back to normal!",
              },
            },
            isStackable: false,
            originateFrom: SpellsBlueprint.CleavingStomp,
          });
        }
      },
    });

    return true;
  },
};
