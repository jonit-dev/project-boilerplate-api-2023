import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { EffectableAttribute, ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { FoodsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemBlueberry: Partial<IItem> = {
  key: FoodsBlueprint.Blueberry,
  type: ItemType.Consumable,
  subType: ItemSubType.Food,
  textureAtlas: "items",
  texturePath: "foods/blueberry.png",
  name: "Blueberry",
  description:
    "A blueberry is a small, sweet berry that grows in clusters on bushes. Blueberries are a good source of vitamin C and fiber.",
  weight: 0.01,
  maxStackSize: 100,
  basePrice: 5,
  usableEffect: (character: ICharacter) => {
    ItemUsableEffect.apply(character, EffectableAttribute.Health, 0.5);
  },
};
