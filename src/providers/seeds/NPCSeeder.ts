import { NPC } from "@entities/ModuleSystem/NPCModel";
import { NPCMetaData } from "@providers/data/npcs";
import { provide } from "inversify-binding-decorators";

@provide(NPCSeeder)
export class NPCSeeder {
  public async seed(): Promise<void> {
    const npcs = await NPC.find();

    if (!npcs.length || NPCMetaData.length !== npcs.length) {
      console.log("🌱 Seeding database with NPC data...");

      for (const npcMetaData of NPCMetaData) {
        const npcExists = await NPC.find({ name: npcMetaData.key });

        if (!npcExists) {
          const newNPC = new NPC(npcMetaData);
          await newNPC.save();
        } else {
          // if npc already exists, restart initial position
          await NPC.updateOne({ name: npcMetaData.key }, { x: npcMetaData.x, y: npcMetaData.y });
        }
      }
    }
  }
}
