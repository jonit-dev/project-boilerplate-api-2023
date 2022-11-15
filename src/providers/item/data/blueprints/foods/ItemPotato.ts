import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { EffectableAttribute, ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { FoodsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemPotato: Partial<IItem> = {
  key: FoodsBlueprint.Potato,
  type: ItemType.Consumable,
  subType: ItemSubType.Food,
  textureAtlas: "items",
  texturePath: "foods/potato.png",

  name: "Potato",
  description: "You see a short sword. It is a single-handed sword with a handle that just features a grip.",
  weight: 10,
  maxStackSize: 100,
  basePrice: 10,
  usableEffect: (character: ICharacter) => {
    ItemUsableEffect.apply(character, EffectableAttribute.Health, 1);
  },
};
