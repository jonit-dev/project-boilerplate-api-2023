import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { container } from "@providers/inversify/container";
import { AnimationEffectKeys, BasicAttribute, CharacterClass, SpellCastingType } from "@rpg-engine/shared";
import { SpellCalculator } from "../../abstractions/SpellCalculator";
import { ISpell, NamespaceRedisControl, SpellsBlueprint } from "../../types/SpellsBlueprintTypes";

export const spellManaShield: Partial<ISpell> = {
  key: SpellsBlueprint.SorcererManaShield,
  name: "Mana Shield",
  description: "A spell designed for a sorcerer to takes damage but damage is reduced from mana.",
  castingType: SpellCastingType.SelfCasting,
  magicWords: "mana scutum",
  manaCost: 50,
  minLevelRequired: 5,
  minMagicLevelRequired: 7,
  cooldown: 40,
  animationKey: AnimationEffectKeys.MagicShield,
  projectileAnimationKey: AnimationEffectKeys.Energy,
  characterClass: [CharacterClass.Sorcerer],

  usableEffect: async (character: ICharacter) => {
    const inMemoryHashTable = container.get(InMemoryHashTable);

    const spellCalculator = container.get(SpellCalculator);

    const timeout = await spellCalculator.calculateTimeoutBasedOnSkillLevel(character, BasicAttribute.Magic, {
      min: 40,
      max: 180,
    });

    const namespace = `${NamespaceRedisControl.CharacterSpell}:${character._id}`;
    const key = SpellsBlueprint.SorcererManaShield;

    await inMemoryHashTable.set(namespace, key, true);
    await inMemoryHashTable.expire(namespace, timeout, "NX");
  },
};
