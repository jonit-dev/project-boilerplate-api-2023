import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container } from "@providers/inversify/container";
import { MagicsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { AnimationEffectKeys, SpellCastingType } from "@rpg-engine/shared";
import { SpellItemCreation } from "../abstractions/SpellItemCreation";
import { ISpell, SpellsBlueprint } from "../types/SpellsBlueprintTypes";

export const spellBlankRuneCreation: Partial<ISpell> = {
  key: SpellsBlueprint.BlankRuneCreationSpell,

  name: "Blank Rune Creation Spell",
  description: "A spell that creates a blank rune in your inventory.",

  castingType: SpellCastingType.SelfCasting,
  magicWords: "iquar ansr ki",
  manaCost: 15,
  minLevelRequired: 2,
  minMagicLevelRequired: 3,
  animationKey: AnimationEffectKeys.LevelUp,

  usableEffect: async (character: ICharacter) => {
    const spellItemCreation = container.get(SpellItemCreation);

    return await spellItemCreation.createItem(character, {
      itemToCreate: {
        key: MagicsBlueprint.Rune,
        createQty: 1,
      },
    });
  },
};
