import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { provide } from "inversify-binding-decorators";

export interface IRaid {
  name: string;
  key: string;
  startingMessage?: string;
  status?: boolean;
  triggeringChance: number;
  lastActivationTime?: Date;
  minDuration: number;
}

//* This class is a global raid manager. It does not manage raid NPCs individually. For this, see NPCRaid.ts

@provide(RaidManager)
export class RaidManager {
  constructor(private inMemoryHashTable: InMemoryHashTable) {}

  public async addRaid(raid: IRaid): Promise<void> {
    if (!raid.status) {
      raid.status = false;
    }

    await this.inMemoryHashTable.set("raids", raid.key, raid);
  }

  public async getRaid(key: string): Promise<IRaid | undefined> {
    const raid = (await this.inMemoryHashTable.get("raids", key)) as IRaid | undefined;

    return raid;
  }

  public async getAllRaids(): Promise<IRaid[]> {
    return Object.values((await this.inMemoryHashTable.getAll("raids")) as unknown as IRaid[]);
  }

  public async isRaidActive(key: string): Promise<boolean> {
    if (!key) {
      return false;
    }

    const raid = await this.getRaid(key);

    if (!raid) {
      return false;
    }

    return raid.status === true;
  }

  public async getAllActiveRaids(): Promise<IRaid[]> {
    return await this.queryRaids({ status: true });
  }

  @TrackNewRelicTransaction()
  public async queryRaids(query: Partial<IRaid>): Promise<IRaid[]> {
    const raids = Object.values(await this.getAllRaids());

    return raids.filter((raid) => {
      return Object.keys(query).every((key) => {
        return raid[key] === query[key];
      });
    });
  }

  public async getAllRaidKeys(): Promise<string[]> {
    return (await this.inMemoryHashTable.getAllKeys("raids")) as string[];
  }

  public async deleteRaid(key: string): Promise<void> {
    await this.inMemoryHashTable.delete("raids", key);
  }

  public async deleteAllRaids(): Promise<void> {
    await this.inMemoryHashTable.deleteAll("raids");
  }

  public async updateRaid(key: string, updatedFields: Partial<IRaid>): Promise<void> {
    const currentRaid = await this.getRaid(key);

    await this.inMemoryHashTable.set("raids", key, {
      ...currentRaid,
      ...updatedFields,
    });
  }
}
