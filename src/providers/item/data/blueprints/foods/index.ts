import { FoodsBlueprint } from "../../types/blueprintTypes";
import { itemApple } from "./ItemApple";
import { itemBananaBunch } from "./ItemBananaBunch";
import { itemBanana } from "./ItemBanana";
import { itemBread } from "./ItemBread";
import { itemCheeseSlice } from "./ItemCheeseSlice";
import { itemCheese } from "./ItemCheese";
import { itemCookie } from "./ItemCookie";
import { itemEgg } from "./ItemEgg";
import { itemFish } from "./ItemFish";
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
};
