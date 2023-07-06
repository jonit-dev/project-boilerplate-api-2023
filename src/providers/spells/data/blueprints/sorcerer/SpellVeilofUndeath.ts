import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { CharacterTextureChange } from "@providers/character/CharacterTextureChange";
import { CharacterBuffActivator } from "@providers/character/characterBuff/CharacterBuffActivator";
import { container } from "@providers/inversify/container";
import {
  AnimationEffectKeys,
  BasicAttribute,
  CharacterBuffDurationType,
  CharacterBuffType,
  CharacterClass,
  SpellCastingType,
} from "@rpg-engine/shared";
import { SpellCalculator } from "../../abstractions/SpellCalculator";
import { ISpell, SpellsBlueprint } from "../../types/SpellsBlueprintTypes";

export const spellVeilofUndeath: Partial<ISpell> = {
  key: SpellsBlueprint.SorcererVeilofUndeath,
  name: "Veil of Undeath Spell",
  description: "A spell designed to turn a sorcerer into a Powerfull Lich. Raise Magic Attack.",
  castingType: SpellCastingType.SelfCasting,
  magicWords: "talas umbra",
  manaCost: 200,
  minLevelRequired: 10,
  minMagicLevelRequired: 10,
  cooldown: 60,
  castingAnimationKey: AnimationEffectKeys.ManaHeal,
  characterClass: [CharacterClass.Sorcerer],

  usableEffect: async (character: ICharacter) => {
    const characterBuffActivator = container.get(CharacterBuffActivator);
    const characterTextureChange = container.get(CharacterTextureChange);
    const spellCalculator = container.get(SpellCalculator);

    const timeoutInSecs = await spellCalculator.calculateTimeoutBasedOnSkillLevel(character, BasicAttribute.Magic, {
      min: 15,
      max: 60,
    });

    const buffPercentage = await spellCalculator.calculateBuffBasedOnSkillLevel(character, BasicAttribute.Magic, {
      min: 10,
      max: 20,
    });

    await characterBuffActivator.enableTemporaryBuff(character, {
      type: CharacterBuffType.Skill,
      trait: BasicAttribute.Magic,
      buffPercentage: buffPercentage,
      durationSeconds: timeoutInSecs,
      durationType: CharacterBuffDurationType.Temporary,
      options: {
        messages: {
          activation: "You feel stronger as a lich. Your magic power are increased by " + buffPercentage + "%.",
          deactivation: "You feel weaker again.",
        },
      },
    });

    await characterTextureChange.changeTexture(character, "litch", timeoutInSecs, "veil of undeath");
  },
};
