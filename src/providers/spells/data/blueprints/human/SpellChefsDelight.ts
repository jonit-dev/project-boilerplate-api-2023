import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { CharacterBuffActivator } from "@providers/character/characterBuff/CharacterBuffActivator";
import { container } from "@providers/inversify/container";
import {
  AnimationEffectKeys,
  CharacterBuffDurationType,
  CharacterBuffType,
  CraftingSkill,
  ISpell,
  LifeBringerRaces,
  SpellCastingType,
  SpellsBlueprint,
} from "@rpg-engine/shared";
import { SpellCalculator } from "../../abstractions/SpellCalculator";

export const spellChefsDelight: Partial<ISpell> = {
  key: SpellsBlueprint.ChefsDelight,
  name: "Chef's delight",
  description: "Temporarily increases human's cooking skill.",
  castingType: SpellCastingType.SelfCasting,
  magicWords: "les cook",
  manaCost: 25,
  minLevelRequired: 5,
  minMagicLevelRequired: 5,
  cooldown: 160,
  castingAnimationKey: AnimationEffectKeys.HasteSpell,
  attribute: CraftingSkill.Cooking,
  characterRace: [LifeBringerRaces.Human],

  usableEffect: async (character: ICharacter) => {
    const characterBuffActivator = container.get(CharacterBuffActivator);

    const spellCalculator = container.get(SpellCalculator);

    const [timeout, buffPercentage] = await Promise.all([
      spellCalculator.calculateBasedOnSkillLevel(character, CraftingSkill.Cooking, {
        min: 20,
        max: 180,
      }),
      spellCalculator.calculateBasedOnSkillLevel(character, CraftingSkill.Cooking, {
        min: 5,
        max: 40,
      }),
    ]);

    await characterBuffActivator.enableTemporaryBuff(character, {
      type: CharacterBuffType.Skill,
      trait: CraftingSkill.Cooking,
      buffPercentage,
      durationSeconds: timeout,
      durationType: CharacterBuffDurationType.Temporary,
      isStackable: false,
      originateFrom: SpellsBlueprint.ChefsDelight,
    });
  },
};
