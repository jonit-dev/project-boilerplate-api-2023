import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container } from "@providers/inversify/container";
import { RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import {
  AnimationEffectKeys,
  BasicAttribute,
  CharacterClass,
  ISpell,
  SpellCastingType,
  SpellsBlueprint,
} from "@rpg-engine/shared";
import { SpellCalculator } from "../../abstractions/SpellCalculator";
import { SpellItemCreation } from "../../abstractions/SpellItemCreation";

export const spellEmeraldArrowCreation: Partial<ISpell> = {
  key: SpellsBlueprint.EmeraldArrowCreation,
  name: "Emerald Arrow Creation",
  description: "A spell that creates emerald arrows in your inventory.",

  castingType: SpellCastingType.SelfCasting,
  magicWords: "verdeum sagitta",
  manaCost: 25,
  minLevelRequired: 6,
  minMagicLevelRequired: 5,
  cooldown: 10,
  castingAnimationKey: AnimationEffectKeys.LevelUp,
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
        key: RangedWeaponsBlueprint.EmeraldArrow,
        createQty,
      },
    });
  },
};
