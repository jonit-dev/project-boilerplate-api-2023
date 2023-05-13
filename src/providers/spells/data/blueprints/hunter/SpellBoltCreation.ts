import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container } from "@providers/inversify/container";
import { RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { AnimationEffectKeys, BasicAttribute, CharacterClass, SpellCastingType } from "@rpg-engine/shared";
import { SpellCalculator } from "../../abstractions/SpellCalculator";
import { SpellItemCreation } from "../../abstractions/SpellItemCreation";
import { ISpell, SpellsBlueprint } from "../../types/SpellsBlueprintTypes";

export const spellBoltCreation: Partial<ISpell> = {
  key: SpellsBlueprint.BoltCreationSpell,

  name: "Bolt Creation Spell",
  description: "A spell that creates bolt in your inventory.",

  castingType: SpellCastingType.SelfCasting,
  magicWords: "iquar lyn",
  manaCost: 15,
  minLevelRequired: 8,
  minMagicLevelRequired: 3,
  cooldown: 5,
  animationKey: AnimationEffectKeys.LevelUp,
  characterClass: [CharacterClass.Hunter],

  usableEffect: async (character: ICharacter) => {
    const spellCalculator = container.get(SpellCalculator);
    const createQty = await spellCalculator.getQuantityBasedOnSkillLevel(character, BasicAttribute.Magic, {
      max: 100,
      min: 1,
    });

    const spellItemCreation = container.get(SpellItemCreation);

    return await spellItemCreation.createItem(character, {
      itemToCreate: {
        key: RangedWeaponsBlueprint.Bolt,
        createQty,
      },
    });
  },
};
