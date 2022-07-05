import { BodiesBlueprint } from "../../types/blueprintTypes";
import { itemCharacterBody } from "./ItemCharacterBody";
import { itemNPCBody } from "./ItemNPCBody";

export const bodiesBlueprintsIndex = {
  [BodiesBlueprint.CharacterBody]: itemCharacterBody,
  [BodiesBlueprint.NPCBody]: itemNPCBody,
};