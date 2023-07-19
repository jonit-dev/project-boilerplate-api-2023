import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { CharacterBuffActivator } from "@providers/character/characterBuff/CharacterBuffActivator";
import { container } from "@providers/inversify/container";
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

export const spellQuickFire: Partial<ISpell> = {
  key: SpellsBlueprint.HunterQuickFire,
  name: "QuickFire",
  description: "QuickFire spell unleash a flurry of attacks on their enemies.",
  castingType: SpellCastingType.SelfCasting,
  magicWords: "ieiunium iecit",
  manaCost: 120,
  minLevelRequired: 10,
  minMagicLevelRequired: 8,
  cooldown: 120,
  castingAnimationKey: AnimationEffectKeys.BlueWings,
  characterClass: [CharacterClass.Hunter],
  attribute: CharacterAttributes.AttackIntervalSpeed,

  usableEffect: async (character: ICharacter) => {
    const characterBuffActivator = container.get(CharacterBuffActivator);
    const spellCalculator = container.get(SpellCalculator);

    const timeout = await spellCalculator.calculateBasedOnSkillLevel(character, BasicAttribute.Magic, {
      min: 20,
      max: 120,
    });

    const buffPercentage = await spellCalculator.calculateBasedOnSkillLevel(character, BasicAttribute.Magic, {
      min: 20,
      max: 35,
    });

    await characterBuffActivator.enableTemporaryBuff(character, {
      type: CharacterBuffType.CharacterAttribute,
      trait: CharacterAttributes.AttackIntervalSpeed,
      buffPercentage: -buffPercentage,
      durationSeconds: timeout,
      durationType: CharacterBuffDurationType.Temporary,
      isStackable: false,
      originateFrom: SpellsBlueprint.HunterQuickFire,
    });
  },
};
