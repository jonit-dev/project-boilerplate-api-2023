import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { provide } from "inversify-binding-decorators";
import { RaidManager } from "./RaidManager";

@provide(NPCRaidSpawn)
export class NPCRaidSpawn {
  constructor(private raidManager: RaidManager) {}

  @TrackNewRelicTransaction()
  public async fetchDeadNPCsFromActiveRaids(): Promise<INPC[]> {
    const deadRaidNPCs = await NPC.find({
      health: 0,
      raidKey: { $exists: true },
    });

    const activeRaids = await this.raidManager.getAllActiveRaids();

    const deadNPCsFromActiveRaids = deadRaidNPCs.filter((npc) => {
      return activeRaids.some((raid) => raid.key === npc.raidKey);
    });

    return deadNPCsFromActiveRaids;
  }
}
