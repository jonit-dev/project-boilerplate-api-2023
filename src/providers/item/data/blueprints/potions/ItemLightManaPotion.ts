import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container } from "@providers/inversify/container";
import { EffectableAttribute, ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { IConsumableItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import round from "lodash/round";
import { PotionsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemLightManaPotion: IConsumableItemBlueprint = {
  key: PotionsBlueprint.LightManaPotion,
  type: ItemType.Consumable,
  subType: ItemSubType.Potion,
  textureAtlas: "items",
  texturePath: "potions/light-mana-potion.png",

  name: "Light Mana Potion",
  description: "A light flask containing blue liquid of a mana potion.",
  weight: 0.5,
  basePrice: 10,
  maxStackSize: 100,
  canSell: false,
  usableEffect: (character: ICharacter) => {
    const itemUsableEffect = container.get(ItemUsableEffect);

    const characterManaPercentage = round(character.maxMana * 0.1); // 10% of char max mana

    itemUsableEffect.apply(character, EffectableAttribute.Mana, characterManaPercentage);
  },
  usableEffectDescription: "Restores 10% of mana",
};
