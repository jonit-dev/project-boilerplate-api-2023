import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container } from "@providers/inversify/container";
import { MagicsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { AnimationEffectKeys, CharacterClass, ISpell, SpellCastingType, SpellsBlueprint } from "@rpg-engine/shared";
import { SpellItemCreation } from "../../abstractions/SpellItemCreation";

export const spellDarkRuneCreation: Partial<ISpell> = {
  key: SpellsBlueprint.DarkRuneCreationSpell,

  name: "Dark Rune Creation Spell",
  description: "A spell that converts a blank rune, in your inventory, into dark rune.",

  castingType: SpellCastingType.SelfCasting,
  magicWords: "iquar ansr nevae",
  manaCost: 250,
  minLevelRequired: 8,
  minMagicLevelRequired: 8,
  cooldown: 5,
  castingAnimationKey: AnimationEffectKeys.HitDark,
  projectileAnimationKey: AnimationEffectKeys.Dark,
  characterClass: [CharacterClass.Sorcerer],

  requiredItem: MagicsBlueprint.Rune,

  usableEffect: async (character: ICharacter) => {
    const spellRuneCreation = container.get(SpellItemCreation);

    return await spellRuneCreation.createItem(character, {
      itemToCreate: {
        key: MagicsBlueprint.DarkRune,
      },
      itemToConsume: {
        key: MagicsBlueprint.Rune,
        onErrorMessage: "You do not have any blank rune to create a Dark Rune.",
      },
    });
  },
};
