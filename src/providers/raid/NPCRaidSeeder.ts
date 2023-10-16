import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { provide } from "inversify-binding-decorators";
import { availableRaids } from "./NPCAvailableRaids";
import { IRaid, RaidManager } from "./RaidManager";

@provide(NPCRaidSeeder)
export class NPCRaidSeeder {
  constructor(private raid: RaidManager) {}

  @TrackNewRelicTransaction()
  public async seed(): Promise<void> {
    const raids: IRaid[] = availableRaids;

    try {
      const existingRaids = await this.raid.getAllRaidKeys();

      for (const raid of raids) {
        if (!existingRaids.includes(raid.key)) {
          await this.raid.addRaid(raid);
        }
      }
    } catch (error) {
      this.log(`Error while seeding raids: ${error.message}`, "error");
    }
  }

  private log(message: string, level: "info" | "error" = "info"): void {
    if (level === "error") {
      console.error(message);
    } else {
      console.log(message);
    }
  }
}
