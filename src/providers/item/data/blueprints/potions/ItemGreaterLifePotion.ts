import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { container } from "@providers/inversify/container";
import { EffectableAttribute, ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import round from "lodash/round";
import { PotionsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemGreaterLifePotion: Partial<IItem> = {
  key: PotionsBlueprint.GreaterLifePotion,
  type: ItemType.Consumable,
  subType: ItemSubType.Potion,
  textureAtlas: "items",
  texturePath: "potions/greater-life-potion.png",

  name: "Greater Life Potion",
  description: "A flask containing deep red liquid of a greater elixir of life.",
  weight: 0.5,
  basePrice: 50,
  maxStackSize: 100,
  canSell: false,
  usableEffect: (character: ICharacter) => {
    const itemUsableEffect = container.get(ItemUsableEffect);

    const characterHealthPercentage = round(character.maxHealth * 0.15); // 15% of char max health

    itemUsableEffect.apply(character, EffectableAttribute.Health, characterHealthPercentage);
  },
};
