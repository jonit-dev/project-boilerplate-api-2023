import { FoodsBlueprint } from "../../types/itemsBlueprintTypes";
import { itemApple } from "./ItemApple";
import { itemBanana } from "./ItemBanana";
import { itemBananaBunch } from "./ItemBananaBunch";
import { itemBread } from "./ItemBread";
import { itemCheese } from "./ItemCheese";
import { itemCheeseSlice } from "./ItemCheeseSlice";
import { itemChickensMeat } from "./ItemChickensMeat";
import { itemCookie } from "./ItemCookie";
import { itemEgg } from "./ItemEgg";
import { itemFish } from "./ItemFish";
import { itemMushroom } from "./ItemMushroom";
import { itemSalmon } from "./ItemSalmon";

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
};
