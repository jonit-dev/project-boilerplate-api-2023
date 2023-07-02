import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container } from "@providers/inversify/container";
import { MagicsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { AnimationEffectKeys, ISpell, SpellCastingType, SpellsBlueprint } from "@rpg-engine/shared";
import { SpellItemCreation } from "../../abstractions/SpellItemCreation";

export const spellFireRuneCreation: Partial<ISpell> = {
  key: SpellsBlueprint.FireRuneCreationSpell,

  name: "Fire Rune Creation Spell",
  description: "A spell that converts a blank rune, in your inventory, into fire rune.",

  castingType: SpellCastingType.SelfCasting,
  magicWords: "iquar ansr maskan",
  manaCost: 60,
  minLevelRequired: 4,
  minMagicLevelRequired: 6,
  cooldown: 60,
  castingAnimationKey: AnimationEffectKeys.LevelUp,

  requiredItem: MagicsBlueprint.Rune,

  usableEffect: async (character: ICharacter) => {
    const spellRuneCreation = container.get(SpellItemCreation);

    return await spellRuneCreation.createItem(character, {
      itemToCreate: {
        key: MagicsBlueprint.FireRune,
      },
      itemToConsume: {
        key: MagicsBlueprint.Rune,
        onErrorMessage: "You do not have any blank rune to create a Fire Rune.",
      },
    });
  },
};
