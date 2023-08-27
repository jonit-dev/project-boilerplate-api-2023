import { ItemSeeder } from "@providers/item/ItemSeeder";
import { QuestSeeder } from "@providers/quest/QuestSeeder";

import { NPCRaidSeeder } from "@providers/raid/NPCRaidSeeder";
import { provide } from "inversify-binding-decorators";
import { NPCSeeder } from "../npc/NPCSeeder";
import { RedisCleanup } from "./RedisCleanup";

@provide(Seeder)
export class Seeder {
  constructor(
    private npcSeeder: NPCSeeder,
    private itemSeeder: ItemSeeder,
    private questSeeder: QuestSeeder,
    private npcRaidSeeder: NPCRaidSeeder,
    private redisCleanup: RedisCleanup
  ) {}

  public async start(): Promise<void> {
    console.time("🌱 Seeding");
    await this.npcSeeder.seed();
    await this.itemSeeder.seed();
    await this.questSeeder.seed();
    await this.npcRaidSeeder.seed();
    await this.redisCleanup.cleanup();
    console.timeEnd("🌱 Seeding");
  }
}
