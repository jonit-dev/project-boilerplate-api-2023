import { NPC } from "@entities/ModuleSystem/NPCModel";
import { NPCLoader } from "@providers/npc/npcs/NPCLoader";
import { ISocketTransmissionZone, SocketTransmissionZone } from "@providers/sockets/SocketTransmissionZone";
import { GRID_HEIGHT, GRID_WIDTH, SOCKET_TRANSMISSION_ZONE_WIDTH } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(NPCSeeder)
export class NPCSeeder {
  constructor(private socketTransmissionZone: SocketTransmissionZone) {}

  public async seed(): Promise<void> {
    for (const [key, NPCData] of NPCLoader.NPCMetaData.entries()) {
      const npcFound = await NPC.exists({ key: key });

      const { x, y, width, height } = this.getSocketTransmissionZone(NPCData.x, NPCData.y);

      if (!npcFound) {
        console.log(`🌱 Seeding database with NPC data for NPC with key: ${key}`);

        NPCData.socketTransmissionZone = {
          x,
          y,
          width,
          height,
        };

        const newNPC = new NPC(NPCData);

        await newNPC.save();
      } else {
        // if npc already exists, restart initial position
        await NPC.updateOne(
          { name: key },
          {
            $set: {
              x: NPCData.x,
              y: NPCData.y,
              socketTransmissionZone: {
                x,
                y,
                width,
                height,
              },
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
