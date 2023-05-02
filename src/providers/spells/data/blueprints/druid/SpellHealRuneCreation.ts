import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container } from "@providers/inversify/container";
import { MagicsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { AnimationEffectKeys, CharacterClass, SpellCastingType } from "@rpg-engine/shared";
import { SpellItemCreation } from "../../abstractions/SpellItemCreation";
import { ISpell, SpellsBlueprint } from "../../types/SpellsBlueprintTypes";

export const spellHealRuneCreation: Partial<ISpell> = {
  key: SpellsBlueprint.HealRuneCreationSpell,

  name: "Healing Rune Creation Spell",
  description: "A spell that converts a blank rune, in your inventory, into healing rune.",

  castingType: SpellCastingType.SelfCasting,
  magicWords: "iquar ansr faenya",
  manaCost: 40,
  minLevelRequired: 4,
  minMagicLevelRequired: 6,
  cooldown: 5,
  animationKey: AnimationEffectKeys.LevelUp,
  characterClass: [CharacterClass.Druid],

  requiredItem: MagicsBlueprint.Rune,

  usableEffect: async (character: ICharacter) => {
    const spellRuneCreation = container.get(SpellItemCreation);

    return await spellRuneCreation.createItem(character, {
      itemToCreate: {
        key: MagicsBlueprint.HealRune,
      },
      itemToConsume: {
        key: MagicsBlueprint.Rune,
        onErrorMessage: "You do not have any blank rune to create a Heal Rune.",
      },
    });
  },
};
