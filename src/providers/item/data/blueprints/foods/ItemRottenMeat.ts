import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { EffectableAttribute, ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { FoodsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemRottenMeat: Partial<IItem> = {
  key: FoodsBlueprint.RottenMeat,
  type: ItemType.Consumable,
  subType: ItemSubType.Food,
  textureAtlas: "items",
  texturePath: "foods/rotten-meat.png",
  name: "Rotten Meat",
  description: "A piece of rotten meat. Don't eat it!",
  weight: 0.25,
  maxStackSize: 10,
  basePrice: 1,
  usableEffect: (character: ICharacter) => {
    ItemUsableEffect.apply(character, EffectableAttribute.Health, -2);
  },
};
