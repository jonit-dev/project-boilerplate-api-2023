import { NPC } from "@entities/ModuleSystem/NPCModel";
import { NPCMetaData } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(NPCSeeder)
export class NPCSeeder {
  public async seed(): Promise<void> {
    for (const npcData of NPCMetaData) {
      const npcFound = await NPC.exists({ key: npcData.key });

      if (!npcFound) {
        console.log("🌱 Seeding database with NPC data...");
        const newNPC = new NPC(npcData);
        await newNPC.save();
      } else {
        // if npc already exists, restart initial position
        await NPC.updateOne({ name: npcData.key }, { $set: { x: npcData.x, y: npcData.y } });
      }
    }
  }
}
