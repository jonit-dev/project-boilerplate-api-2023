import { ItemSeeder } from "@providers/item/ItemSeeder";
import { provide } from "inversify-binding-decorators";
import { NPCSeeder } from "../npc/NPCSeeder";

@provide(Seeder)
export class Seeder {
  constructor(private npcSeeder: NPCSeeder, private itemSeeder: ItemSeeder) {}

  public async start(): Promise<void> {
    await this.npcSeeder.seed();
    await this.itemSeeder.seed();
  }
}
