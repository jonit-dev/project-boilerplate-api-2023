import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container } from "@providers/inversify/container";
import { RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { AnimationEffectKeys, CharacterClass, SpellCastingType } from "@rpg-engine/shared";
import { SpellItemCreation } from "../../abstractions/SpellItemCreation";
import { SpellItemQuantityCalculator } from "../../abstractions/SpellItemQuantityCalculator";
import { ISpell, SpellsBlueprint } from "../../types/SpellsBlueprintTypes";

export const spellFireBoltCreation: Partial<ISpell> = {
  key: SpellsBlueprint.FireBoltCreationSpell,

  name: "Fire Bolt Creation Spell",
  description: "A spell that creates fire bolts in your inventory.",

  castingType: SpellCastingType.SelfCasting,
  magicWords: "naur iquar lyn",
  manaCost: 25,
  minLevelRequired: 15,
  minMagicLevelRequired: 5,
  cooldown: 5,
  animationKey: AnimationEffectKeys.LevelUp,
  characterClass: [CharacterClass.Hunter],

  usableEffect: async (character: ICharacter) => {
    const spellItemQuantityCalculator = container.get(SpellItemQuantityCalculator);
    const createQty = await spellItemQuantityCalculator.getQuantityBasedOnSkillLevel(character, "magic", {
      max: 100,
      min: 1,
      difficulty: 5,
    });

    const spellItemCreation = container.get(SpellItemCreation);

    return await spellItemCreation.createItem(character, {
      itemToCreate: {
        key: RangedWeaponsBlueprint.FireBolt,
        createQty,
      },
    });
  },
};
