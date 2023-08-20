import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
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
import SpellSilence from "../../logic/mage/druid/SpellSilence";

export const spellSilence: Partial<ISpell> = {
  key: SpellsBlueprint.DruidSilence,
  name: "Silence Spell",
  description: "A spell that prevents the target from casting spells for a short period.",
  castingType: SpellCastingType.RangedCasting,
  magicWords: "vocem inhibeo",
  manaCost: 150,
  minLevelRequired: 15,
  minMagicLevelRequired: 17,
  cooldown: 120,
  targetHitAnimationKey: AnimationEffectKeys.Miss,
  projectileAnimationKey: AnimationEffectKeys.Blue,
  castingAnimationKey: AnimationEffectKeys.MagicShield,
  maxDistanceGrid: RangeTypes.Medium,
  characterClass: [CharacterClass.Druid],

  usableEffect: async (character: ICharacter, target: ICharacter | INPC) => {
    const silence = container.get(SpellSilence);
    const spellCalculator = container.get(SpellCalculator);

    const timeoutInSecs = await spellCalculator.calculateBasedOnSkillLevel(character, BasicAttribute.Magic, {
      min: 5,
      max: 10,
    });

    await silence.silenceCharacter(character, target, timeoutInSecs);

    return true;
  },
};
