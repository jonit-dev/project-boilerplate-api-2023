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

export const spellFireBoltCreation: Partial<ISpell> = {
  key: SpellsBlueprint.FireBoltCreationSpell,

  name: "Fire Bolt Creation Spell",
  description: "A spell that creates fire bolts in your inventory.",

  castingType: SpellCastingType.SelfCasting,
  magicWords: "naur iquar lyn",
  manaCost: 25,
  minLevelRequired: 7,
  minMagicLevelRequired: 5,
  cooldown: 30,
  castingAnimationKey: AnimationEffectKeys.LevelUp,
  characterClass: [CharacterClass.Hunter],

  usableEffect: async (character: ICharacter) => {
    const spellCalculator = container.get(SpellCalculator);
    const createQty = await spellCalculator.getQuantityBasedOnSkillLevel(character, BasicAttribute.Magic, {
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
