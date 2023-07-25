import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { CharacterBuffActivator } from "@providers/character/characterBuff/CharacterBuffActivator";
import { container } from "@providers/inversify/container";
import {
  AnimationEffectKeys,
  BasicAttribute,
  CharacterAttributes,
  CharacterBuffDurationType,
  CharacterBuffType,
  ISpell,
  SpellCastingType,
  SpellsBlueprint,
} from "@rpg-engine/shared";
import { SpellCalculator } from "../../abstractions/SpellCalculator";

export const spellSelfHaste: Partial<ISpell> = {
  key: SpellsBlueprint.SelfHasteSpell,
  name: "Self Haste Spell",
  description: "A self haste spell.",
  castingType: SpellCastingType.SelfCasting,
  magicWords: "talas hiz",
  manaCost: 80,
  minLevelRequired: 5,
  minMagicLevelRequired: 5,
  cooldown: 60,
  castingAnimationKey: AnimationEffectKeys.HasteSpell,
  attribute: CharacterAttributes.Speed,

  usableEffect: async (character: ICharacter) => {
    const characterBuffActivator = container.get(CharacterBuffActivator);

    const spellCalculator = container.get(SpellCalculator);

    const timeout = await spellCalculator.calculateBasedOnSkillLevel(character, BasicAttribute.Magic, {
      min: 30,
      max: 60,
    });

    const buffPercentage = await spellCalculator.calculateBasedOnSkillLevel(character, BasicAttribute.Magic, {
      min: 7,
      max: 20,
    });

    await characterBuffActivator.enableTemporaryBuff(character, {
      type: CharacterBuffType.CharacterAttribute,
      trait: CharacterAttributes.Speed,
      buffPercentage,
      durationSeconds: timeout,
      durationType: CharacterBuffDurationType.Temporary,
      isStackable: false,
      originateFrom: SpellsBlueprint.SelfHasteSpell,
    });
  },
};
