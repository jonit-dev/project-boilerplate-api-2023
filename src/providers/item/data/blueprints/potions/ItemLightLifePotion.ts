import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { container } from "@providers/inversify/container";
import { EffectableAttribute, ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import round from "lodash/round";
import { PotionsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemLightLifePotion: Partial<IItem> = {
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
  usableEffect: (character: ICharacter) => {
    const itemUsableEffect = container.get(ItemUsableEffect);

    const characterHealthPercentage = round(character.maxHealth * 0.05); // 5% of char max health

    itemUsableEffect.apply(character, EffectableAttribute.Health, characterHealthPercentage);
  },
};
