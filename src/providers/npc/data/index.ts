import { IBlueprint } from "@providers/types/temp/BlueprintTypes";
import { npcAgatha } from "./blueprints/NPCAgatha";
import { npcAlice } from "./blueprints/NPCAlice";
import { npcAnnie } from "./blueprints/NPCAnnie";
import { npcFelicia } from "./blueprints/NPCFelicia";
import { npcMaria } from "./blueprints/NPCMaria";
import { npcOrc } from "./blueprints/NPCOrc";
import { npcSkeleton } from "./blueprints/NPCSkeleton";

export const npcsBlueprintIndex: IBlueprint = {
  agatha: npcAgatha,
  alice: npcAlice,
  annie: npcAnnie,
  felicia: npcFelicia,
  maria: npcMaria,
  orc: npcOrc,
  skeleton: npcSkeleton,
};
