import { IBlueprint } from "@providers/types/temp/BlueprintTypes";
import { npcAgatha } from "./blueprints/NPCAgatha";
import { npcAlice } from "./blueprints/NPCAlice";
import { npcAnnie } from "./blueprints/NPCAnnie";
import { npcFelicia } from "./blueprints/NPCFelicia";
import { npcMaria } from "./blueprints/NPCMaria";
import { npcMonster } from "./blueprints/NPCMonster";

export const npcsBlueprintIndex: IBlueprint = {
  agatha: npcAgatha,
  alice: npcAlice,
  annie: npcAnnie,
  felicia: npcFelicia,
  maria: npcMaria,
  monster: npcMonster,
};
