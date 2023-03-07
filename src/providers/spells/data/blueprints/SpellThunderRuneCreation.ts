import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container } from "@providers/inversify/container";
import { MagicsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { AnimationEffectKeys, SpellCastingType } from "@rpg-engine/shared";
import { SpellItemCreation } from "../abstractions/SpellItemCreation";
import { ISpell, SpellsBlueprint } from "../types/SpellsBlueprintTypes";

export const spellThunderRuneCreation: Partial<ISpell> = {
  key: SpellsBlueprint.ThunderRuneCreationSpell,

  name: "Thunder Rune Creation Spell",
  description: "A spell that converts a blank rune, in your inventory, into Thunder rune.",

  castingType: SpellCastingType.SelfCasting,
  magicWords: "iquar ansr runu",
  manaCost: 40,
  minLevelRequired: 6,
  minMagicLevelRequired: 4,
  animationKey: AnimationEffectKeys.LevelUp,

  requiredItem: MagicsBlueprint.Rune,

  usableEffect: async (character: ICharacter) => {
    const spellRuneCreation = container.get(SpellItemCreation);

    await spellRuneCreation.createItem(character, {
      itemToCreate: {
        key: MagicsBlueprint.ThunderRune,
      },
      itemToConsume: {
        key: MagicsBlueprint.Rune,
        onErrorMessage: "You do not have any blank rune to create a Thunder Rune.",
      },
    });
  },
};
