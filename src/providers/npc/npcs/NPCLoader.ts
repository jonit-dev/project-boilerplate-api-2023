import { INPC } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { agathaMetaData } from "./NPCAgatha";
import { aliceMetaData } from "./NPCAlice";
import { feliciaMetaData } from "./NPCFelicia";
import { mariaNPCMetaData } from "./NPCMaria";

interface INPCMetaData extends Omit<INPC, "_id"> {}

@provide(NPCLoader)
export class NPCLoader {
  public static NPCMetaData = new Map<string, INPCMetaData>();

  public init(): void {
    NPCLoader.NPCMetaData.set("alice", aliceMetaData);
    NPCLoader.NPCMetaData.set("maria", mariaNPCMetaData);
    NPCLoader.NPCMetaData.set("felicia", feliciaMetaData);
    NPCLoader.NPCMetaData.set("agatha", agathaMetaData);
  }
}
