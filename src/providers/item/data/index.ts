import { IBlueprint } from "@providers/types/temp/BlueprintTypes";
import { itemCharacterBody } from "./blueprints/ItemCharacterBody";
import { itemGroundBlood } from "./blueprints/ItemGroundBlood";
import { itemNPCBody } from "./blueprints/ItemNPCBody";
import { itemShortSword } from "./blueprints/ItemShortSword";
import { itemWingHelmet } from "./blueprints/ItemWingHelmet";

export const itemsBlueprintIndex: IBlueprint = {
  "short-sword": itemShortSword,
  "character-body": itemCharacterBody,
  "ground-blood": itemGroundBlood,
  "npc-body": itemNPCBody,
  "wing-helmet": itemWingHelmet,
};
