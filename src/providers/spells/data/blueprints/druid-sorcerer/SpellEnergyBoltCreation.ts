import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container } from "@providers/inversify/container";
import { MagicsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { AnimationEffectKeys, CharacterClass, SpellCastingType } from "@rpg-engine/shared";
import { SpellItemCreation } from "../../abstractions/SpellItemCreation";
import { ISpell, SpellsBlueprint } from "../../types/SpellsBlueprintTypes";

export const spellEnergyBoltCreation: Partial<ISpell> = {
  key: SpellsBlueprint.EnergyBoltCreationSpell,

  name: "Energy Bolt Creation Spell",
  description: "A spell that creates an energy bolt in your inventory.",

  castingType: SpellCastingType.SelfCasting,
  magicWords: "iquar kiran oorja",
  manaCost: 40,
  minLevelRequired: 4,
  minMagicLevelRequired: 3,
  animationKey: AnimationEffectKeys.LevelUp,
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
