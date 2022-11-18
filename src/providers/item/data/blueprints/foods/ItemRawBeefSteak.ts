import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { EffectableAttribute, ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { FoodsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemRawBeefSteak: Partial<IItem> = {
  key: FoodsBlueprint.RawBeefSteak,
  type: ItemType.Consumable,
  subType: ItemSubType.Food,
  textureAtlas: "items",
  texturePath: "foods/raw-beef-steak.png",
  name: "Raw Beef Steak",
  description: "A raw beef steak that can be used for cooking, but shouldn't be consumed raw.",
  weight: 3,
  maxStackSize: 10,
  basePrice: 20,
  hasUseWith: true,
  usableEffect: (character: ICharacter) => {
    ItemUsableEffect.apply(character, EffectableAttribute.Health, -1);
  },
};
