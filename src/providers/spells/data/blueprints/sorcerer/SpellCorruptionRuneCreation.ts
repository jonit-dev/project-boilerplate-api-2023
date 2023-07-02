import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container } from "@providers/inversify/container";
import { MagicsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { AnimationEffectKeys, CharacterClass, SpellCastingType } from "@rpg-engine/shared";
import { SpellItemCreation } from "../../abstractions/SpellItemCreation";
import { ISpell, SpellsBlueprint } from "../../types/SpellsBlueprintTypes";

export const spellCorruptionRuneCreation: Partial<ISpell> = {
  key: SpellsBlueprint.CorruptionRuneCreationSpell,

  name: "Corruption Rune Creation Spell",
  description: "A spell that converts a blank rune, in your inventory, into corruption rune.",
  castingType: SpellCastingType.SelfCasting,
  magicWords: "iquar ansr umbra",
  manaCost: 900,
  minLevelRequired: 15,
  minMagicLevelRequired: 15,
  cooldown: 5,
  castingAnimationKey: AnimationEffectKeys.HitCorruption,
  projectileAnimationKey: AnimationEffectKeys.Dark,
  characterClass: [CharacterClass.Sorcerer],

  requiredItem: MagicsBlueprint.Rune,

  usableEffect: async (character: ICharacter) => {
    const spellRuneCreation = container.get(SpellItemCreation);

    return await spellRuneCreation.createItem(character, {
      itemToCreate: {
        key: MagicsBlueprint.CorruptionRune,
      },
      itemToConsume: {
        key: MagicsBlueprint.Rune,
        onErrorMessage: "You do not have any blank rune to create a Corruption Rune.",
      },
    });
  },
};
