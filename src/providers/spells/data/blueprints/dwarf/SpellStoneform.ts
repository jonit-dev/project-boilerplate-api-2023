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

export const spellStoneform: Partial<ISpell> = {
  key: SpellsBlueprint.DwarfStoneform,
  name: "Stoneform",
  description: "Temporarily increases drawf's mining skill.",
  castingType: SpellCastingType.SelfCasting,
  magicWords: "ston smask",
  manaCost: 25,
  minLevelRequired: 5,
  minMagicLevelRequired: 5,
  cooldown: 160,
  castingAnimationKey: AnimationEffectKeys.HasteSpell,
  attribute: CraftingSkill.Mining,
  characterRace: [LifeBringerRaces.Dwarf],

  usableEffect: async (character: ICharacter) => {
    const characterBuffActivator = container.get(CharacterBuffActivator);

    const spellCalculator = container.get(SpellCalculator);

    const [timeout, buffPercentage] = await Promise.all([
      spellCalculator.calculateBasedOnSkillLevel(character, CraftingSkill.Mining, {
        min: 15,
        max: 80,
      }),
      spellCalculator.calculateBasedOnSkillLevel(character, CraftingSkill.Mining, {
        min: 5,
        max: 40,
      }),
    ]);

    await characterBuffActivator.enableTemporaryBuff(character, {
      type: CharacterBuffType.Skill,
      trait: CraftingSkill.Mining,
      buffPercentage,
      durationSeconds: timeout,
      durationType: CharacterBuffDurationType.Temporary,
      isStackable: false,
      originateFrom: SpellsBlueprint.DwarfStoneform,
    });
  },
};
