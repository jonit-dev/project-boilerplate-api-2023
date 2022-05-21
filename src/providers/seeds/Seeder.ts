import { provide } from "inversify-binding-decorators";
import { NPCSeeder } from "../npc/NPCSeeder";

@provide(Seeder)
export class Seeder {
  constructor(private npcSeeder: NPCSeeder) {}

  public async start(): Promise<void> {
    await this.npcSeeder.seed();
  }
}
