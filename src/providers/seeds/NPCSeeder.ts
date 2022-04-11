import { NPC } from "@entities/ModuleNPC/NPCModel";
import { MapLoader } from "@providers/map/MapLoader";
import { INPCMetaData, NPCLoader } from "@providers/npc/NPCLoader";
import { ScenesMetaData, ToGridX, ToGridY } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(NPCSeeder)
export class NPCSeeder {
  public async seed(): Promise<void> {
    for (const [key, NPCData] of NPCLoader.NPCMetaData.entries()) {
      const npcFound = await NPC.exists({ tiledId: NPCData.tiledId });

      NPCData.targetCharacter = undefined; // reset any targets

      this.setInitialNPCPositionAsSolid(NPCData);

      if (!npcFound) {
        console.log(`🌱 Seeding database with NPC data for NPC with key: ${NPCData.key}`);

        const newNPC = new NPC(NPCData);
        await newNPC.save();
      } else {
        // if npc already exists, restart initial position

        console.log(`Updating NPC ${NPCData.key} metadata...`);

        await NPC.updateOne(
          { key: key },
          {
            $set: {
              ...NPCData,
            },
          }
        );
      }
    }
  }

  private setInitialNPCPositionAsSolid(NPCData: INPCMetaData): void {
    // mark NPC initial position as solid on the map (pathfinding)
    MapLoader.grids
      .get(ScenesMetaData[NPCData.scene].map)!
      .setWalkableAt(ToGridX(NPCData.x), ToGridY(NPCData.y), false);
  }
}
