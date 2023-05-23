import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { container } from "@providers/inversify/container";
import {
  AnimationEffectKeys,
  BasicAttribute,
  CharacterClass,
  ISpell,
  SpellCastingType,
  SpellsBlueprint,
} from "@rpg-engine/shared";
import { SpellCalculator } from "../../abstractions/SpellCalculator";
import { NamespaceRedisControl } from "../../types/SpellsBlueprintTypes";

export const spellBloodthirst: Partial<ISpell> = {
  key: SpellsBlueprint.BerserkerBloodthirst,
  name: "Bloodthirst",
  description: "Bloodthirst is a spell designed for a Berserker to heal themselves.",
  castingType: SpellCastingType.SelfCasting,
  magicWords: "sanguis sitis",
  manaCost: 70,
  minLevelRequired: 4,
  minMagicLevelRequired: 3,
  cooldown: 60,
  castingAnimationKey: AnimationEffectKeys.Holy,
  characterClass: [CharacterClass.Berserker],

  usableEffect: async (character: ICharacter) => {
    const inMemoryHashTable = container.get(InMemoryHashTable);

    const spellCalculator = await container.get(SpellCalculator);

    const timeout = await spellCalculator.calculateTimeoutBasedOnSkillLevel(character, BasicAttribute.Strength, {
      min: 30,
      max: 120,
    });

    const namespace = `${NamespaceRedisControl.CharacterSpell}:${character._id}`;
    const key = SpellsBlueprint.BerserkerBloodthirst;

    await inMemoryHashTable.set(namespace, key, true);
    await inMemoryHashTable.expire(namespace, timeout, "NX");
  },
};
