import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { EffectableAttribute, ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { FoodsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemWildSalmon: Partial<IItem> = {
  key: FoodsBlueprint.WildSalmon,
  type: ItemType.Consumable,
  subType: ItemSubType.Food,
  textureAtlas: "items",
  texturePath: "foods/wild-salmon.png",
  name: "Wild Salmon",
  description: "A common fish that can be caught in rivers and it's the favorite food of bears.",
  weight: 1,
  maxStackSize: 100,
  basePrice: 10,
  usableEffect: (character: ICharacter) => {
    ItemUsableEffect.apply(character, EffectableAttribute.Health, 1.5);
  },
};
