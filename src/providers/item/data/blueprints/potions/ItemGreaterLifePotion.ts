import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { EffectableAttribute, ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { PotionsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemGreaterLifePotion: Partial<IItem> = {
  key: PotionsBlueprint.GreaterLifePotion,
  type: ItemType.Consumable,
  subType: ItemSubType.Magic,
  textureAtlas: "items",
  texturePath: "potions/greater-life-potion.png",

  name: "Greater Life Potion",
  description: "A flask containing deep red liquid of a greater elixir of life.",
  weight: 0.5,
  basePrice: 50,
  maxStackSize: 100,
  canSell: false,
  usableEffect: (character: ICharacter) => {
    ItemUsableEffect.apply(character, EffectableAttribute.Health, 70);
  },
};
