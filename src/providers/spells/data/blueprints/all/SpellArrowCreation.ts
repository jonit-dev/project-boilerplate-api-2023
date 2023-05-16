import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container } from "@providers/inversify/container";
import { RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { AnimationEffectKeys, BasicAttribute, ISpell, SpellCastingType, SpellsBlueprint } from "@rpg-engine/shared";
import { SpellCalculator } from "../../abstractions/SpellCalculator";
import { SpellItemCreation } from "../../abstractions/SpellItemCreation";

export const spellArrowCreation: Partial<ISpell> = {
  key: SpellsBlueprint.ArrowCreationSpell,

  name: "Arrow Creation Spell",
  description: "A spell that creates arrow in your inventory.",

  castingType: SpellCastingType.SelfCasting,
  magicWords: "iquar elandi",
  manaCost: 10,
  minLevelRequired: 2,
  minMagicLevelRequired: 2,
  cooldown: 5,
  castingAnimationKey: AnimationEffectKeys.LevelUp,

  usableEffect: async (character: ICharacter) => {
    const spellCalculator = container.get(SpellCalculator);
    const createQty = await spellCalculator.getQuantityBasedOnSkillLevel(character, BasicAttribute.Magic, {
      max: 100,
      min: 1,
    });

    const spellItemCreation = container.get(SpellItemCreation);

    return await spellItemCreation.createItem(character, {
      itemToCreate: {
        key: RangedWeaponsBlueprint.Arrow,
        createQty,
      },
    });
  },
};
