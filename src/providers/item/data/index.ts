import { IBlueprint } from "@providers/types/temp/BlueprintTypes";
import { itemCharacterBody } from "./blueprints/ItemCharacterBody";
import { itemShortSword } from "./blueprints/ItemShortSword";

export const itemsBlueprintIndex: IBlueprint = {
  "short-sword": itemShortSword,
  "character-body": itemCharacterBody,
};
