import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill } from "@entities/ModuleCharacter/SkillsModel";
import { container } from "@providers/inversify/container";
import { RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { AnimationEffectKeys, SpellCastingType } from "@rpg-engine/shared";
import random from "lodash/random";
import { SpellItemCreation } from "../abstractions/SpellItemCreation";
import { ISpell, SpellsBlueprint } from "../types/SpellsBlueprintTypes";

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
    const characterWithSkills = await character.populate("skills").execPopulate();
    const skills = characterWithSkills.skills as unknown as ISkill;
    const magicLevel = skills.magic.level as number;

    let itemsToCreate = random(1, magicLevel || 3);

    if (itemsToCreate > 100) {
      itemsToCreate = 100;
    }
    const spellItemCreation = container.get(SpellItemCreation);

    await spellItemCreation.createItem(character, {
      itemToCreate: {
        key: RangedWeaponsBlueprint.Arrow,
        createQty: itemsToCreate,
      },
    });
  },
};
