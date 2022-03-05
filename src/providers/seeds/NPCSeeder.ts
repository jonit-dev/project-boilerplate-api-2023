import { NPC } from "@entities/ModuleSystem/NPCModel";
import { NPCMetaData } from "@providers/data/npcs";
import { provide } from "inversify-binding-decorators";

@provide(NPCSeeder)
export class NPCSeeder {
  public async seed(): Promise<void> {
    const npcs = await NPC.find();

    if (!npcs.length || NPCMetaData.length !== npcs.length) {
      console.log("🌱 Seeding database with NPC data...");

      for (const npc of NPCMetaData) {
        const npcExists = await NPC.exists({ name: npc.name });

        if (!npcExists) {
          const newNPC = new NPC(npc);
          await newNPC.save();
        }
      }
    }
  }
}
