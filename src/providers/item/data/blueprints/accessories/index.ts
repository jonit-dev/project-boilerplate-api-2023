import { AccessoriesBlueprint } from "../../types/itemsBlueprintTypes";
import { itemBandana } from "./ItemBandana";
import { itemCorruptionNecklace } from "./ItemCorruptionNecklace";
import { itemDeathNecklace } from "./ItemDeathNecklace";
import { itemElvenRing } from "./ItemElvenRing";
import { itemSilverKey } from "./itemSilverKey";

export const accessoriesBlueprintsIndex = {
  [AccessoriesBlueprint.SilverKey]: itemSilverKey,
  [AccessoriesBlueprint.CorruptionNecklace]: itemCorruptionNecklace,
  [AccessoriesBlueprint.DeathNecklace]: itemDeathNecklace,
  [AccessoriesBlueprint.Bandana]: itemBandana,
  [AccessoriesBlueprint.ElvenRing]: itemElvenRing,
};
