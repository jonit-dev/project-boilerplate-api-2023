import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container } from "@providers/inversify/container";
import { MagicsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { AnimationEffectKeys, ISpell, SpellCastingType, SpellsBlueprint } from "@rpg-engine/shared";
import { SpellItemCreation } from "../../abstractions/SpellItemCreation";

export const spellPoisonRuneCreation: Partial<ISpell> = {
  key: SpellsBlueprint.PoisonRuneCreationSpell,

  name: "Poison Rune Creation Spell",
  description: "A spell that converts a blank rune, in your inventory, into poison rune.",

  castingType: SpellCastingType.SelfCasting,
  magicWords: "iquar ansr athil",
  manaCost: 50,
  minLevelRequired: 3,
  minMagicLevelRequired: 3,
  cooldown: 5,
  castingAnimationKey: AnimationEffectKeys.LevelUp,

  requiredItem: MagicsBlueprint.Rune,

  usableEffect: async (character: ICharacter) => {
    const spellRuneCreation = container.get(SpellItemCreation);

    return await spellRuneCreation.createItem(character, {
      itemToCreate: {
        key: MagicsBlueprint.PoisonRune,
      },
      itemToConsume: {
        key: MagicsBlueprint.Rune,
        onErrorMessage: "You do not have any blank rune to create a Poison Rune.",
      },
    });
  },
};
