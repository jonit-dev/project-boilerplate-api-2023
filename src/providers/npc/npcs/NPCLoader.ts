import { INPC } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { npcAgathaMetaData } from "./NPCAgatha";
import { npcAliceMetaData } from "./NPCAlice";
import { npcAnnieMetaData } from "./NPCAnnie";
import { npcFeliciaMetaData } from "./NPCFelicia";
import { npcMariaMetaData } from "./NPCMaria";

interface INPCMetaData extends Omit<INPC, "_id"> {}

@provide(NPCLoader)
export class NPCLoader {
  public static NPCMetaData = new Map<string, INPCMetaData>();

  public init(): void {
    NPCLoader.NPCMetaData.set("alice", npcAliceMetaData);
    NPCLoader.NPCMetaData.set("maria", npcMariaMetaData);
    NPCLoader.NPCMetaData.set("felicia", npcFeliciaMetaData);
    NPCLoader.NPCMetaData.set("agatha", npcAgathaMetaData);
    NPCLoader.NPCMetaData.set("annie", npcAnnieMetaData);
  }
}
