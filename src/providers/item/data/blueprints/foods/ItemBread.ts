import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { EffectableAttribute, ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { FoodsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemBread: Partial<IItem> = {
  key: FoodsBlueprint.Bread,
  type: ItemType.Consumable,
  subType: ItemSubType.Food,
  textureAtlas: "items",
  texturePath: "foods/bread.png",

  name: "Bread",
  description: "A loaf of bread.",
  weight: 0.1,
  usableEffect: (character: ICharacter) => {
    ItemUsableEffect.apply(character, EffectableAttribute.Health, 1);
  },
};
