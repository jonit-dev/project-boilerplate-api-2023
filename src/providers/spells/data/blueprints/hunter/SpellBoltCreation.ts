import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill } from "@entities/ModuleCharacter/SkillsModel";
import { container } from "@providers/inversify/container";
import { RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { AnimationEffectKeys, CharacterClass, SpellCastingType } from "@rpg-engine/shared";
import random from "lodash/random";
import round from "lodash/round";
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
    const characterWithSkills = await character.populate("skills").execPopulate();
    const skills = characterWithSkills.skills as unknown as ISkill;
    const magicLevel = skills.magic.level as number;

    let itemsToCreate = round(random(1, magicLevel / 4));

    if (itemsToCreate > 100) {
      itemsToCreate = 100;
    }

    const spellItemCreation = container.get(SpellItemCreation);

    return await spellItemCreation.createItem(character, {
      itemToCreate: {
        key: RangedWeaponsBlueprint.Bolt,
        createQty: itemsToCreate,
      },
    });
  },
};
