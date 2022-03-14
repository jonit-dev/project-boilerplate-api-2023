import { INPC } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { aliceMetaData } from "./NPCAlice";
import { mariaNPCMetaData } from "./NPCMaria";

interface INPCMetaData extends Omit<INPC, "_id"> {}

@provide(NPCLoader)
export class NPCLoader {
  public static NPCMetaData = new Map<string, INPCMetaData>();

  public init(): void {
    NPCLoader.NPCMetaData.set("alice", aliceMetaData);
    NPCLoader.NPCMetaData.set("maria", mariaNPCMetaData);
  }
}
