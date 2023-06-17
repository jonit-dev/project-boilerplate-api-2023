import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container } from "@providers/inversify/container";
import { EffectableAttribute, ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { SpellCalculator } from "@providers/spells/data/abstractions/SpellCalculator";
import { CraftingSkill, IConsumableItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { PotionsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemGreaterManaPotion: IConsumableItemBlueprint = {
  key: PotionsBlueprint.GreaterManaPotion,
  type: ItemType.Consumable,
  subType: ItemSubType.Potion,
  textureAtlas: "items",
  texturePath: "potions/greater-mana-potion.png",

  name: "Greater Mana Potion",
  description: "A greater flask containing blue liquid of a mana potion.",
  weight: 0.5,
  basePrice: 40,
  maxStackSize: 100,
  canSell: false,
  usableEffect: async (character: ICharacter) => {
    const itemUsableEffect = container.get(ItemUsableEffect);

    const spellCalculator = container.get(SpellCalculator);

    const percentage = await spellCalculator.calculateBuffBasedOnSkillLevel(character, CraftingSkill.Alchemy, {
      min: 20,
      max: 35,
    });

    const totalAmount = (character.maxMana * percentage) / 100;

    itemUsableEffect.apply(character, EffectableAttribute.Mana, totalAmount);
  },
  usableEffectDescription: "Restores 20-35% of mana, based on Alchemy skill level",
};
