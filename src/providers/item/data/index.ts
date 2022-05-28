import { IBlueprint } from "@providers/types/temp/BlueprintTypes";
import { itemCharacterBody } from "./blueprints/ItemCharacterBody";
import { itemGroundBlood } from "./blueprints/ItemGroundBlood";
import { itemShortSword } from "./blueprints/ItemShortSword";

export const itemsBlueprintIndex: IBlueprint = {
  "short-sword": itemShortSword,
  "character-body": itemCharacterBody,
  "ground-blood": itemGroundBlood,
};
