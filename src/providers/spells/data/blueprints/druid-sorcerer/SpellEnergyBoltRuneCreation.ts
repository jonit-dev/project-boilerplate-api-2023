import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container } from "@providers/inversify/container";
import { MagicsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { AnimationEffectKeys, CharacterClass, ISpell, SpellCastingType, SpellsBlueprint } from "@rpg-engine/shared";
import { SpellItemCreation } from "../../abstractions/SpellItemCreation";

export const spellEnergyBoltRuneCreation: Partial<ISpell> = {
  key: SpellsBlueprint.EnergyBoltRuneCreationSpell,

  name: "Energy Bolt Creation Spell",
  description: "A spell that creates an energy bolt in your inventory.",

  castingType: SpellCastingType.SelfCasting,
  magicWords: "iquar kiran oorja",
  manaCost: 450,
  minLevelRequired: 6,
  minMagicLevelRequired: 8,
  cooldown: 5,
  castingAnimationKey: AnimationEffectKeys.LevelUp,
  characterClass: [CharacterClass.Druid, CharacterClass.Sorcerer],

  usableEffect: async (character: ICharacter) => {
    const spellRuneCreation = container.get(SpellItemCreation);

    return await spellRuneCreation.createItem(character, {
      itemToCreate: {
        key: MagicsBlueprint.EnergyBoltRune,
      },
      itemToConsume: {
        key: MagicsBlueprint.Rune,
        onErrorMessage: "You do not have any blank rune to create a Energy Bolt Rune.",
      },
    });
  },
};
