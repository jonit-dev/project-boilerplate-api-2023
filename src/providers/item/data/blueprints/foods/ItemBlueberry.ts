import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container } from "@providers/inversify/container";
import { ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { IConsumableItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { FoodsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemBlueberry: IConsumableItemBlueprint = {
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
  basePrice: 2,
  canSell: false,

  usableEffect: (character: ICharacter) => {
    const itemUsableEffect = container.get(ItemUsableEffect);

    itemUsableEffect.applyEatingEffect(character, 1);
  },
};
