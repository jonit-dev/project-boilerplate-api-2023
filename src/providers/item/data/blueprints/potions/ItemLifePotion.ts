import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container } from "@providers/inversify/container";
import { EffectableAttribute, ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { SpellCalculator } from "@providers/spells/data/abstractions/SpellCalculator";
import { CraftingSkill, IConsumableItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { PotionsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemLifePotion: IConsumableItemBlueprint = {
  key: PotionsBlueprint.LifePotion,
  type: ItemType.Consumable,
  subType: ItemSubType.Potion,
  textureAtlas: "items",
  texturePath: "potions/life-potion.png",

  name: "Life Potion",
  description: "A flask containing an elixir of life.",
  weight: 0.5,
  basePrice: 20,
  maxStackSize: 100,
  canSell: false,
  usableEffect: async (character: ICharacter) => {
    const itemUsableEffect = container.get(ItemUsableEffect);

    const spellCalculator = container.get(SpellCalculator);

    const percentage = await spellCalculator.calculateBuffBasedOnSkillLevel(character, CraftingSkill.Alchemy, {
      min: 10,
      max: 20,
    });

    const totalAmount = (character.maxHealth * percentage) / 100;

    itemUsableEffect.apply(character, EffectableAttribute.Health, totalAmount);
  },
  usableEffectDescription: "Restores 10-20% of health, based on Alchemy skill level",
};
