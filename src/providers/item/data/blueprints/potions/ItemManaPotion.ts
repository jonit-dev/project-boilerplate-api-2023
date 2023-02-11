import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { EffectableAttribute, ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { PotionsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemManaPotion: Partial<IItem> = {
  key: PotionsBlueprint.ManaPotion,
  type: ItemType.Consumable,
  subType: ItemSubType.Magic,
  textureAtlas: "items",
  texturePath: "potions/mana-potion.png",

  name: "Mana Potion",
  description: "A flask containing blue liquid of a mana potion.",
  weight: 0.5,
  basePrice: 20,
  maxStackSize: 100,
  canSell: false,
  usableEffect: (character: ICharacter) => {
    ItemUsableEffect.apply(character, EffectableAttribute.Mana, 20);
  },
};
