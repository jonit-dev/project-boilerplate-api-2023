import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container } from "@providers/inversify/container";
import { MagicsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { AnimationEffectKeys, ISpell, SpellCastingType, SpellsBlueprint } from "@rpg-engine/shared";
import { SpellItemCreation } from "../../abstractions/SpellItemCreation";

export const spellBlankRuneCreation: Partial<ISpell> = {
  key: SpellsBlueprint.BlankRuneCreationSpell,

  name: "Blank Rune Creation Spell",
  description: "A spell that creates a blank rune in your inventory.",

  castingType: SpellCastingType.SelfCasting,
  magicWords: "iquar ansr ki",
  manaCost: 30,
  minLevelRequired: 2,
  minMagicLevelRequired: 3,
  cooldown: 5,
  castingAnimationKey: AnimationEffectKeys.LevelUp,

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
