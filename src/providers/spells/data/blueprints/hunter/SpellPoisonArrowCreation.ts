import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container } from "@providers/inversify/container";
import { RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { AnimationEffectKeys, BasicAttribute, CharacterClass, SpellCastingType } from "@rpg-engine/shared";
import { SpellCalculator } from "../../abstractions/SpellCalculator";
import { SpellItemCreation } from "../../abstractions/SpellItemCreation";
import { ISpell, SpellsBlueprint } from "../../types/SpellsBlueprintTypes";

export const spellPoisonArrowCreation: Partial<ISpell> = {
  key: SpellsBlueprint.PoisonArrowCreationSpell,
  name: "Poison Arrow Creation Spell",
  description: "A spell that creates poison arrows in your inventory.",

  castingType: SpellCastingType.SelfCasting,
  magicWords: "thalion pilya",
  manaCost: 25,
  minLevelRequired: 12,
  minMagicLevelRequired: 4,
  cooldown: 10,
  animationKey: AnimationEffectKeys.LevelUp,
  characterClass: [CharacterClass.Hunter],

  usableEffect: async (character: ICharacter) => {
    const spellItemCreation = container.get(SpellItemCreation);

    const spellCalculator = container.get(SpellCalculator);
    const createQty = await spellCalculator.getQuantityBasedOnSkillLevel(character, BasicAttribute.Magic, {
      max: 100,
      min: 1,
      difficulty: 4,
    });

    return await spellItemCreation.createItem(character, {
      itemToCreate: {
        key: RangedWeaponsBlueprint.PoisonArrow,
        createQty,
      },
    });
  },
};
