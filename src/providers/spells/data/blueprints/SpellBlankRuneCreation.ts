import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { CharacterInventory } from "@providers/character/CharacterInventory";
import { CharacterItemInventory } from "@providers/character/characterItems/CharacterItemInventory";
import { container } from "@providers/inversify/container";
import { MagicsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { AnimationEffectKeys, SpellCastingType } from "@rpg-engine/shared";
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
    const characterItemInventory = container.get(CharacterItemInventory);
    const characterInventory = container.get(CharacterInventory);

    const added = await characterItemInventory.addItemToInventory(MagicsBlueprint.Rune, character);
    if (added) {
      await characterInventory.sendInventoryUpdateEvent(character);
    }
  },
};
