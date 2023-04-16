import { FoodsBlueprint } from "../../types/itemsBlueprintTypes";
import { itemApple } from "./ItemApple";
import { itemBanana } from "./ItemBanana";
import { itemBananaBunch } from "./ItemBananaBunch";
import { itemBlueberry } from "./ItemBlueberry";
import { itemBread } from "./ItemBread";
import { itemBrownFish } from "./ItemBrownFish";
import { itemBrownMushroom } from "./ItemBrownMushroom";
import { itemCheese } from "./ItemCheese";
import { itemCheeseSlice } from "./ItemCheeseSlice";
import { itemChickensMeat } from "./ItemChickensMeat";
import { itemCoconut } from "./ItemCoconut";
import { itemCookie } from "./ItemCookie";
import { itemEgg } from "./ItemEgg";
import { itemFish } from "./ItemFish";
import { itemIceMushroom } from "./ItemIceMushroom";
import { itemMilk } from "./ItemMilk";
import { itemMushroom } from "./ItemMushroom";
import { itemPineapple } from "./ItemPineapple";
import { itemPotato } from "./ItemPotato";
import { itemRawBeefSteak } from "./ItemRawBeefSteak";
import { itemRedMeat } from "./ItemRedMeat";
import { itemRedMushroom } from "./ItemRedMushroom";
import { itemRottenMeat } from "./ItemRottenMeat";
import { itemSalmon } from "./ItemSalmon";
import { itemTuna } from "./ItemTuna";
import { itemWatermelon } from "./ItemWatermelon";
import { itemWildSalmon } from "./ItemWildSalmon";

export const foodsBlueprintIndex = {
  [FoodsBlueprint.Apple]: itemApple,
  [FoodsBlueprint.BananaBunch]: itemBananaBunch,
  [FoodsBlueprint.Banana]: itemBanana,
  [FoodsBlueprint.Bread]: itemBread,
  [FoodsBlueprint.CheeseSlice]: itemCheeseSlice,
  [FoodsBlueprint.Cheese]: itemCheese,
  [FoodsBlueprint.Cookie]: itemCookie,
  [FoodsBlueprint.Egg]: itemEgg,
  [FoodsBlueprint.Fish]: itemFish,
  [FoodsBlueprint.Salmon]: itemSalmon,
  [FoodsBlueprint.ChickensMeat]: itemChickensMeat,
  [FoodsBlueprint.Mushroom]: itemMushroom,
  [FoodsBlueprint.Potato]: itemPotato,
  [FoodsBlueprint.RedMeat]: itemRedMeat,
  [FoodsBlueprint.WildSalmon]: itemWildSalmon,
  [FoodsBlueprint.Tuna]: itemTuna,
  [FoodsBlueprint.BrownFish]: itemBrownFish,
  [FoodsBlueprint.RawBeefSteak]: itemRawBeefSteak,
  [FoodsBlueprint.Pineapple]: itemPineapple,
  [FoodsBlueprint.Blueberry]: itemBlueberry,
  [FoodsBlueprint.Watermelon]: itemWatermelon,
  [FoodsBlueprint.Coconut]: itemCoconut,
  [FoodsBlueprint.BrownMushroom]: itemBrownMushroom,
  [FoodsBlueprint.RedMushroom]: itemRedMushroom,
  [FoodsBlueprint.IceMushroom]: itemIceMushroom,
  [FoodsBlueprint.RottenMeat]: itemRottenMeat,
  [FoodsBlueprint.Milk]: itemMilk,
};
