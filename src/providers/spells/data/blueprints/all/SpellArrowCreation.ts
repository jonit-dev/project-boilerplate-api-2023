import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container } from "@providers/inversify/container";
import { RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { AnimationEffectKeys, SpellCastingType } from "@rpg-engine/shared";
import { SpellItemCreation } from "../../abstractions/SpellItemCreation";
import { SpellItemQuantityCalculator } from "../../abstractions/SpellItemQuantityCalculator";
import { ISpell, SpellsBlueprint } from "../../types/SpellsBlueprintTypes";

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
  animationKey: AnimationEffectKeys.LevelUp,

  usableEffect: async (character: ICharacter) => {
    const spellItemQuantityCalculator = container.get(SpellItemQuantityCalculator);
    const createQty = await spellItemQuantityCalculator.getQuantityBasedOnSkillLevel(character, "magic", {
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
