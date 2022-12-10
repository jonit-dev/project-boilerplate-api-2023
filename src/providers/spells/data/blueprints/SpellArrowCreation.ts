import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { AnimationEffectKeys, SpellCastingType } from "@rpg-engine/shared";
import { ISpell, SpellsBlueprint } from "../types/SpellsBlueprintTypes";
import { container } from "@providers/inversify/container";
import { RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CharacterItemInventory } from "@providers/character/characterItems/CharacterItemInventory";
import { CharacterInventory } from "@providers/character/CharacterInventory";

export const spellArrowCreation: Partial<ISpell> = {
  key: SpellsBlueprint.ArrowCreationSpell,

  name: "Arrow Creation Spell",
  description: "A spell that creates arrow in your inventory.",

  castingType: SpellCastingType.SelfCasting,
  magicWords: "iquar elandi",
  manaCost: 10,
  minLevelRequired: 2,
  minMagicLevelRequired: 3,
  animationKey: AnimationEffectKeys.LevelUp,

  usableEffect: async (character: ICharacter) => {
    const characterItemInventory = container.get(CharacterItemInventory);
    const characterInventory = container.get(CharacterInventory);

    const added = await characterItemInventory.addItemToInventory(RangedWeaponsBlueprint.Arrow, character);
    if (added) {
      await characterInventory.sendInventoryUpdateEvent(character);
    }
  },
};
