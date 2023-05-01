import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { container } from "@providers/inversify/container";
import { AnimationEffectKeys, CharacterClass, SpellCastingType } from "@rpg-engine/shared";
import { ISpell, NamespaceRedisControl, SpellsBlueprint } from "../../types/SpellsBlueprintTypes";

export const spellBloodthirst: Partial<ISpell> = {
  key: SpellsBlueprint.BerserkerBloodthirst,
  name: "Bloodthirst",
  description: "Bloodthirst is a spell designed for a Berserker to heal themselves.",
  castingType: SpellCastingType.SelfCasting,
  magicWords: "sanguis sitis",
  manaCost: 70,
  minLevelRequired: 10,
  minMagicLevelRequired: 5,
  cooldown: 60,
  animationKey: AnimationEffectKeys.Holy,
  characterClass: [CharacterClass.Berserker],

  usableEffect: async (character: ICharacter) => {
    const inMemoryHashTable = container.get(InMemoryHashTable);

    const skills = (await Skill.findById(character.skills).select("strength.level").lean()) as ISkill;
    const timeout = Math.min(Math.max(skills.strength.level * 3, 20), 120);

    const namespace = `${NamespaceRedisControl.CharacterSpell}:${character._id}`;
    const key = SpellsBlueprint.BerserkerBloodthirst;

    await inMemoryHashTable.set(namespace, key, true);
    await inMemoryHashTable.expire(namespace, timeout, "NX");
  },
};
