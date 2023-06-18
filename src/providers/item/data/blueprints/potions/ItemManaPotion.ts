import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container } from "@providers/inversify/container";
import { EffectableAttribute, ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { SpellCalculator } from "@providers/spells/data/abstractions/SpellCalculator";
import { CraftingSkill, IConsumableItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { PotionsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemManaPotion: IConsumableItemBlueprint = {
  key: PotionsBlueprint.ManaPotion,
  type: ItemType.Consumable,
  subType: ItemSubType.Potion,
  textureAtlas: "items",
  texturePath: "potions/mana-potion.png",

  name: "Mana Potion",
  description: "A flask containing blue liquid of a mana potion.",
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

    const totalAmount = (character.maxMana * percentage) / 100;

    itemUsableEffect.apply(character, EffectableAttribute.Mana, totalAmount);
  },
  usableEffectDescription: "Restores between 10-20% of mana, depending on your Alchemy skill level.",
};
