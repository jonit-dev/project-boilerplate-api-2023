import { NPC } from "@entities/ModuleSystem/NPCModel";
import { NPCMetaDataLoader } from "@providers/npc/NPCLoader";
import { ISocketTransmissionZone, SocketTransmissionZone } from "@providers/sockets/SocketTransmissionZone";
import { GRID_HEIGHT, GRID_WIDTH, SOCKET_TRANSMISSION_ZONE_WIDTH } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(NPCSeeder)
export class NPCSeeder {
  constructor(private socketTransmissionZone: SocketTransmissionZone) {}

  public async seed(): Promise<void> {
    for (const [key, NPCData] of NPCMetaDataLoader.NPCMetaData.entries()) {
      const npcFound = await NPC.exists({ tiledId: NPCData.tiledId });

      const { x, y, width, height } = this.getSocketTransmissionZone(NPCData.x, NPCData.y);

      NPCData.socketTransmissionZone = {
        x,
        y,
        width,
        height,
      };

      NPCData.targetCharacter = undefined; // reset any targets

      if (!npcFound) {
        console.log(`🌱 Seeding database with NPC data for NPC with key: ${NPCData.key}`);

        console.log(NPCData);

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

  private getSocketTransmissionZone(initialX: number, initialY: number): ISocketTransmissionZone {
    return this.socketTransmissionZone.calculateSocketTransmissionZone(
      initialX,
      initialY,
      GRID_WIDTH,
      GRID_HEIGHT,
      SOCKET_TRANSMISSION_ZONE_WIDTH,
      SOCKET_TRANSMISSION_ZONE_WIDTH
    );
  }
}
