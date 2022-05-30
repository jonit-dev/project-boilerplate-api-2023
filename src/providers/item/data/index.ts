import { IBlueprint } from "@providers/types/temp/BlueprintTypes";
import { itemCharacterBody } from "./blueprints/ItemCharacterBody";
import { itemGroundBlood } from "./blueprints/ItemGroundBlood";
import { itemNPCBody } from "./blueprints/ItemNPCBody";
import { itemShortSword } from "./blueprints/ItemShortSword";

export const itemsBlueprintIndex: IBlueprint = {
  "short-sword": itemShortSword,
  "character-body": itemCharacterBody,
  "ground-blood": itemGroundBlood,
  "female-npc-body": itemNPCBody,
};
