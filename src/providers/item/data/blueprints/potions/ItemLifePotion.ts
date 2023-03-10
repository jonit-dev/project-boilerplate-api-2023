import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { container } from "@providers/inversify/container";
import { EffectableAttribute, ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import round from "lodash/round";
import { PotionsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemLifePotion: Partial<IItem> = {
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
  usableEffect: (character: ICharacter) => {
    const itemUsableEffect = container.get(ItemUsableEffect);

    const characterHealthPercentage = round(character.health * 0.1); // 10% of char health

    itemUsableEffect.apply(character, EffectableAttribute.Health, characterHealthPercentage);
  },
};
