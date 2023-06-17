import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container } from "@providers/inversify/container";
import { EffectableAttribute, ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { SpellCalculator } from "@providers/spells/data/abstractions/SpellCalculator";
import { CraftingSkill, IConsumableItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { PotionsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemLightLifePotion: IConsumableItemBlueprint = {
  key: PotionsBlueprint.LightLifePotion,
  type: ItemType.Consumable,
  subType: ItemSubType.Potion,
  textureAtlas: "items",
  texturePath: "potions/light-life-potion.png",

  name: "Light Life Potion",
  description: "A small flask containing an elixir of life.",
  weight: 0.5,
  basePrice: 10,
  maxStackSize: 100,
  canSell: false,
  usableEffect: async (character: ICharacter) => {
    const itemUsableEffect = container.get(ItemUsableEffect);

    const spellCalculator = container.get(SpellCalculator);

    const percentage = await spellCalculator.calculateBuffBasedOnSkillLevel(character, CraftingSkill.Alchemy, {
      min: 5,
      max: 10,
    });

    const totalAmount = (character.maxHealth * percentage) / 100;

    itemUsableEffect.apply(character, EffectableAttribute.Health, totalAmount);
  },
  usableEffectDescription: "Restores 5-10% of health, based on Alchemy skill level",
};
