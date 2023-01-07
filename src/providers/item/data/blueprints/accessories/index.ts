import { AccessoriesBlueprint } from "../../types/itemsBlueprintTypes";
import { itemAmazonsNecklace } from "./ItemAmazonsNecklace";
import { itemBandana } from "./ItemBandana";
import { itemCorruptionNecklace } from "./ItemCorruptionNecklace";
import { itemDeathNecklace } from "./ItemDeathNecklace";
import { itemElvenRing } from "./ItemElvenRing";
import { itemRoyalBracelet } from "./ItemRoyalBracelet";
import { itemSapphireNecklace } from "./ItemSapphireNecklace";
import { itemSilverKey } from "./itemSilverKey";
import { itemStarNecklace } from "./ItemStarNecklace";
import { itemWolfToothChain } from "./ItemWolfToothChain";

export const accessoriesBlueprintsIndex = {
  [AccessoriesBlueprint.SilverKey]: itemSilverKey,
  [AccessoriesBlueprint.CorruptionNecklace]: itemCorruptionNecklace,
  [AccessoriesBlueprint.DeathNecklace]: itemDeathNecklace,
  [AccessoriesBlueprint.Bandana]: itemBandana,
  [AccessoriesBlueprint.ElvenRing]: itemElvenRing,
  [AccessoriesBlueprint.AmazonsNecklace]: itemAmazonsNecklace,
  [AccessoriesBlueprint.RoyalBracelet]: itemRoyalBracelet,
  [AccessoriesBlueprint.SapphireNecklace]: itemSapphireNecklace,
  [AccessoriesBlueprint.StarNecklace]: itemStarNecklace,
  [AccessoriesBlueprint.WolfToothChain]: itemWolfToothChain,
};
