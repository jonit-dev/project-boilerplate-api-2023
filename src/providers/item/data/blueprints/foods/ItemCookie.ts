import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container } from "@providers/inversify/container";
import { ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { IConsumableItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { FoodsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemCookie: IConsumableItemBlueprint = {
  key: FoodsBlueprint.Cookie,
  type: ItemType.Consumable,
  subType: ItemSubType.Food,
  textureAtlas: "items",
  texturePath: "foods/cookie.png",

  name: "Cookie",
  description: "A baked cookie.",
  weight: 0.05,
  maxStackSize: 100,
  basePrice: 2,
  canSell: false,

  usableEffect: (character: ICharacter) => {
    const itemUsableEffect = container.get(ItemUsableEffect);

    itemUsableEffect.applyEatingEffect(character, 1);
  },
  usableEffectDescription: "Restores 1 HP and Mana 5 times",
};
