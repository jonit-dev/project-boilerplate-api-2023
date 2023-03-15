import { IBaseItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { PotionsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemLightEndurancePotion: IBaseItemBlueprint = {
  key: PotionsBlueprint.LightEndurancePotion,
  type: ItemType.Consumable,
  subType: ItemSubType.Potion,
  textureAtlas: "items",
  texturePath: "potions/light-endurance-potion.png",

  name: "Light Endurance Potion",
  description: "A small flask containing an elixir of endurance.",
  weight: 0.5,
  basePrice: 15,
  maxStackSize: 100,
};
