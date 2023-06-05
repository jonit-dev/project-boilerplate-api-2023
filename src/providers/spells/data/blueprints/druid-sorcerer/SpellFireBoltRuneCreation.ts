import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container } from "@providers/inversify/container";
import { MagicsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { AnimationEffectKeys, CharacterClass, ISpell, SpellCastingType, SpellsBlueprint } from "@rpg-engine/shared";
import { SpellItemCreation } from "../../abstractions/SpellItemCreation";

export const spellFireBoltRuneCreation: Partial<ISpell> = {
  key: SpellsBlueprint.FireBoltRuneCreationSpell,

  name: "Fire Bolt Rune Creation Spell",
  description: "A spell that creates a fire bolt rune in your inventory.",

  castingType: SpellCastingType.SelfCasting,
  magicWords: "iquar kiran agni",
  manaCost: 40,
  minLevelRequired: 4,
  minMagicLevelRequired: 6,
  cooldown: 5,
  castingAnimationKey: AnimationEffectKeys.LevelUp,
  characterClass: [CharacterClass.Druid, CharacterClass.Sorcerer],

  usableEffect: async (character: ICharacter) => {
    const spellRuneCreation = container.get(SpellItemCreation);

    return await spellRuneCreation.createItem(character, {
      itemToCreate: {
        key: MagicsBlueprint.FireBoltRune,
      },
      itemToConsume: {
        key: MagicsBlueprint.Rune,
        onErrorMessage: "You do not have any blank rune to create a Fire Bolt Rune.",
      },
    });
  },
};
