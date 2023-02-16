import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Quest } from "@entities/ModuleQuest/QuestModel";
import { provide } from "inversify-binding-decorators";

@provide(NPCQuest)
export class NPCQuest {
  public async hasQuest(npc: INPC): Promise<boolean> {
    const npcQuests = await Quest.find({ npcId: npc._id });
    return !!npcQuests.length;
  }
}
