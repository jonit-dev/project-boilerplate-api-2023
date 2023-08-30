import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { HitTarget } from "@providers/battle/HitTarget";
import { SpellArea } from "@providers/battle/SpellArea";
import { SPELL_AREA_MEDIUM_BLAST_RADIUS } from "@providers/constants/SpellConstants";
import { entityEffectVineGrasp } from "@providers/entityEffects/data/blueprints/entityEffectVineGrasp";
import { characterBuffActivator, container } from "@providers/inversify/container";
import {
  AnimationEffectKeys,
  BasicAttribute,
  CharacterAttributes,
  CharacterBuffDurationType,
  CharacterBuffType,
  CharacterClass,
  ISpell,
  MagicPower,
  RangeTypes,
  SpellCastingType,
  SpellsBlueprint,
} from "@rpg-engine/shared";
import { SpellCalculator } from "../../abstractions/SpellCalculator";

export const spellNaturesRevenge: Partial<ISpell> = {
  key: SpellsBlueprint.NaturesRevenge,
  name: "Nature's Revenge",
  description:
    "Harnesses the wrathful force of nature, invoking a swift eruption of twisting, thorn-covered vines from the earth's embrace. These vines surge outward, engulfing the designated area with relentless fury, entangling all within like nature's wrath incarnate.",
  castingType: SpellCastingType.RangedCasting,
  magicWords: "aldaron nwalme lótealta",
  manaCost: 100,
  minLevelRequired: 14,
  minMagicLevelRequired: 15,
  cooldown: 60,
  castingAnimationKey: AnimationEffectKeys.SkillLevelUp,
  targetHitAnimationKey: AnimationEffectKeys.Rooted,
  projectileAnimationKey: AnimationEffectKeys.HitPoison,
  maxDistanceGrid: RangeTypes.High,
  characterClass: [CharacterClass.Druid],

  usableEffect: async (character: ICharacter, target: ICharacter | INPC) => {
    const spellArea = container.get(SpellArea);

    await spellArea.cast(character, target, MagicPower.High, {
      effectAnimationKey: AnimationEffectKeys.Rooted,
      spellAreaGrid: SPELL_AREA_MEDIUM_BLAST_RADIUS,
      entityEffect: entityEffectVineGrasp,
      customFn: async (target: ICharacter | INPC, intensity: number) => {
        const hitTarget = container.get(HitTarget);
        const spellCalculator = container.get(SpellCalculator);

        await hitTarget.hit(character, target, true, MagicPower.High, true);

        const timeout = await spellCalculator.calculateBasedOnSkillLevel(character, BasicAttribute.Magic, {
          min: 20,
          max: 40,
        });

        const debuffPercentage = await spellCalculator.calculateBasedOnSkillLevel(character, BasicAttribute.Magic, {
          min: 5,
          max: 15,
        });

        if (target.type === "Character") {
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
            originateFrom: SpellsBlueprint.NaturesRevenge,
          });
        }
      },
    });

    return true;
  },
};
