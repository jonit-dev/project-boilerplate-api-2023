import { NPC } from "@entities/ModuleSystem/NPCModel";
import { NPCMetaData } from "@providers/npc/NPCMetaData";
import { provide } from "inversify-binding-decorators";

@provide(NPCSeeder)
export class NPCSeeder {
  public async seed(): Promise<void> {
    for (const [key, NPCData] of NPCMetaData.entries()) {
      const npcFound = await NPC.exists({ key: key });

      if (!npcFound) {
        console.log(`🌱 Seeding database with NPC data for NPC with key: ${key}`);
        const newNPC = new NPC(NPCData);
        await newNPC.save();
      } else {
        // if npc already exists, restart initial position
        await NPC.updateOne({ name: key }, { $set: { x: NPCData.x, y: NPCData.y } });
      }
    }
  }
}
