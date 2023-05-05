import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container } from "@providers/inversify/container";
import { ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { IConsumableItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { FoodsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemBrownMushroom: IConsumableItemBlueprint = {
  key: FoodsBlueprint.BrownMushroom,
  type: ItemType.Consumable,
  subType: ItemSubType.Food,
  textureAtlas: "items",
  texturePath: "foods/brown-mushroom.png",
  name: "Brown Mushroom",
  description: "An edible mushroom that can be eaten to restore health.",
  weight: 0.25,
  maxStackSize: 100,
  basePrice: 2,
  canSell: false,

  usableEffect: (character: ICharacter) => {
    const itemUsableEffect = container.get(ItemUsableEffect);

    itemUsableEffect.applyEatingEffect(character, 1);
  },
  usableEffectDescription: "Restores 1 HP and Mana 5 times",
};
