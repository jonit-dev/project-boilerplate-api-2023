import { INPC } from "@rpg-engine/shared";
import { aliceMetaData as aliceNPCMetaData } from "./NPCAlice";
import { mariaNPCMetaData } from "./NPCMaria";

interface INPCMetaData extends Omit<INPC, "_id"> {
  key: string;
  maxRangeInGridCells?: number;
}

const NPCMetaData = new Map<string, INPCMetaData>();

NPCMetaData.set("alice", aliceNPCMetaData);

NPCMetaData.set("maria", mariaNPCMetaData);

export { NPCMetaData };
