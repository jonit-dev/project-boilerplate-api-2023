import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { CharacterSkillBuff } from "@providers/character/CharacterBuffer/CharacterSkillBuff";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { container } from "@providers/inversify/container";
import { AnimationEffectKeys, CharacterClass, CharacterEntities, SpellCastingType } from "@rpg-engine/shared";
import { ISpell, NamespaceRedisControl, SpellsBlueprint } from "../../types/SpellsBlueprintTypes";

export const spellFrenzy: Partial<ISpell> = {
  key: SpellsBlueprint.BerserkerFrenzy,
  name: "Frenzy",
  description: "A spell that causes a frenzy by increasing your attack speed but lowering your defense.",
  castingType: SpellCastingType.SelfCasting,
  magicWords: "kartal insanus",
  manaCost: 120,
  minLevelRequired: 15,
  minMagicLevelRequired: 10,
  cooldown: 60,
  animationKey: AnimationEffectKeys.QuickFire,
  characterClass: [CharacterClass.Berserker],

  usableEffect: async (character: ICharacter) => {
    const characterSkillBuff = container.get(CharacterSkillBuff);
    const inMemoryHashTable = container.get(InMemoryHashTable);

    const skills = (await Skill.findById(character.skills).lean().select("strength")) as ISkill;

    const timeout = Math.min(Math.max(skills.strength.level * 8, 20), 120);
    const skillType = CharacterEntities.AttackIntervalSpeed;

    await characterSkillBuff.enableTemporaryBuff(character, skillType, 10, timeout);

    const namespace = `${NamespaceRedisControl.CharacterSpell}:${character._id}`;
    const key = SpellsBlueprint.BerserkerFrenzy;

    await inMemoryHashTable.set(namespace, key, true);
    await inMemoryHashTable.expire(namespace, timeout, "NX");

    await inMemoryHashTable.delete(character._id, "totalDefense");

    setTimeout(async () => {
      await inMemoryHashTable.delete(character._id, "totalDefense");
    }, timeout * 1000);
  },
};
