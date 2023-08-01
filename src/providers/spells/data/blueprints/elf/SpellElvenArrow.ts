import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { CharacterBuffActivator } from "@providers/character/characterBuff/CharacterBuffActivator";
import { container } from "@providers/inversify/container";
import {
  AnimationEffectKeys,
  CharacterBuffDurationType,
  CharacterBuffType,
  CombatSkill,
  ISpell,
  LifeBringerRaces,
  SpellCastingType,
  SpellsBlueprint,
} from "@rpg-engine/shared";
import { SpellCalculator } from "../../abstractions/SpellCalculator";

export const spellElvenArrow: Partial<ISpell> = {
  key: SpellsBlueprint.ElvenArrow,
  name: "Elven Arrow",
  description: "Temporarily increases elf's distance skill.",
  castingType: SpellCastingType.SelfCasting,
  magicWords: "dista hast",
  manaCost: 35,
  minLevelRequired: 5,
  minMagicLevelRequired: 5,
  cooldown: 160,
  castingAnimationKey: AnimationEffectKeys.HasteSpell,
  attribute: CombatSkill.Distance,
  characterRace: [LifeBringerRaces.Elf],

  usableEffect: async (character: ICharacter) => {
    const characterBuffActivator = container.get(CharacterBuffActivator);

    const spellCalculator = container.get(SpellCalculator);

    const [timeout, buffPercentage] = await Promise.all([
      spellCalculator.calculateBasedOnSkillLevel(character, CombatSkill.Distance, {
        min: 20,
        max: 90,
      }),
      spellCalculator.calculateBasedOnSkillLevel(character, CombatSkill.Distance, {
        min: 20,
        max: 100,
      }),
    ]);

    await characterBuffActivator.enableTemporaryBuff(character, {
      type: CharacterBuffType.Skill,
      trait: CombatSkill.Distance,
      buffPercentage,
      durationSeconds: timeout,
      durationType: CharacterBuffDurationType.Temporary,
      isStackable: false,
      originateFrom: SpellsBlueprint.ElvenArrow,
    });
  },
};
