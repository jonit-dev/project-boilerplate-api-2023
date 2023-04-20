import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { container } from "@providers/inversify/container";
import { AnimationEffectKeys, CharacterClass, SpellCastingType } from "@rpg-engine/shared";
import { ISpell, NamespaceRedisControl, SpellsBlueprint } from "../../types/SpellsBlueprintTypes";

export const spellManaShield: Partial<ISpell> = {
  key: SpellsBlueprint.SorcererManaShield,
  name: "Mana Shield",
  description: "A spell designed for a sorcerer to takes damage but damage is reduced from mana.",
  castingType: SpellCastingType.SelfCasting,
  magicWords: "mana scutum",
  manaCost: 50,
  minLevelRequired: 5,
  minMagicLevelRequired: 10,
  cooldown: 40,
  animationKey: AnimationEffectKeys.MagicShield,
  projectileAnimationKey: AnimationEffectKeys.Energy,
  characterClass: [CharacterClass.Sorcerer],

  usableEffect: async (character: ICharacter) => {
    const inMemoryHashTable = container.get(InMemoryHashTable);

    const skills = (await Skill.findById(character.skills).select("magic.level").lean()) as ISkill;

    const timeout = Math.min(Math.max(skills.magic.level * 2, 40), 180);

    const namespace = `${NamespaceRedisControl.CharacterSpell}:${character._id}`;
    const key = SpellsBlueprint.SorcererManaShield;

    await inMemoryHashTable.set(namespace, key, true);
    await inMemoryHashTable.expire(namespace, timeout, "NX");
  },
};
