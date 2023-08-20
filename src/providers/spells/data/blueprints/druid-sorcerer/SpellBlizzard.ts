import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { SpellArea } from "@providers/battle/SpellArea";
import { SPELL_AREA_CROSS_BLAST_RADIUS } from "@providers/constants/SpellConstants";
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
import { UsableEffectsBlueprint } from "@providers/item/data/usableEffects/types";

export const spellBlizzard: Partial<ISpell> = {
  key: SpellsBlueprint.Blizzard,
  name: "Blizzard",
  description:
    "Conjures a relentless tempest of ice and snow, enveloping the designated area in a freezing whirlwind of wintry fury.",
  castingType: SpellCastingType.RangedCasting,
  magicWords: "clacial cale",
  manaCost: 10, // 74
  minLevelRequired: 5, // 12
  minMagicLevelRequired: 5, // 7
  cooldown: 3, // 20
  castingAnimationKey: AnimationEffectKeys.SkillLevelUp,
  targetHitAnimationKey: AnimationEffectKeys.Freeze,
  projectileAnimationKey: AnimationEffectKeys.Freeze,
  maxDistanceGrid: RangeTypes.High,
  characterClass: [CharacterClass.Druid, CharacterClass.Sorcerer],

  usableEffect: async (character: ICharacter, target: ICharacter | INPC) => {
    const spellArea = container.get(SpellArea);

    await spellArea.cast(character, target, MagicPower.Medium, {
      effectAnimationKey: AnimationEffectKeys.Freeze,
      spellAreaGrid: SPELL_AREA_CROSS_BLAST_RADIUS,
      customFn: async (target: ICharacter | INPC) => {
        const spellCalculator = container.get(SpellCalculator);

        const timeout = await spellCalculator.calculateBasedOnSkillLevel(character, BasicAttribute.Magic, {
          min: 30,
          max: 60,
        });

        const debuffPercentage = await spellCalculator.calculateBasedOnSkillLevel(character, BasicAttribute.Magic, {
          min: 20,
          max: 35,
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
                activation: `You're frozen, and your speed is reduced! (-${debuffPercentage}%)`,
                deactivation: "You're no longer frozen!",
              },
            },
            isStackable: false,
            originateFrom: UsableEffectsBlueprint.ThunderRuneUsableEffect,
          });
        }
      },
    });

    return true;
  },
};
