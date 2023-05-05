import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container } from "@providers/inversify/container";
import { ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { IConsumableItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { FoodsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemRedMeat: IConsumableItemBlueprint = {
  key: FoodsBlueprint.RedMeat,
  type: ItemType.Consumable,
  subType: ItemSubType.Food,
  textureAtlas: "items",
  texturePath: "foods/red-meat.png",
  name: "Red meat",
  description: "This is a red meat from an animal. You can eat it to restore your health.",
  weight: 2,
  maxStackSize: 100,
  basePrice: 10,
  canSell: false,

  usableEffect: (character: ICharacter) => {
    const itemUsableEffect = container.get(ItemUsableEffect);

    itemUsableEffect.applyEatingEffect(character, 10);
  },
  usableEffectDescription: "Restores 10 HP and Mana 5 times",
};
