import { CharacterTexturesSeeder } from "@providers/characterTextures/CharacterTexturesSeeder";
import { appEnv } from "@providers/config/env";
import { ItemSeeder } from "@providers/item/ItemSeeder";
import { QuestSeeder } from "@providers/quest/QuestSeeder";
import { EnvType } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { NPCSeeder } from "../npc/NPCSeeder";

@provide(Seeder)
export class Seeder {
  constructor(
    private npcSeeder: NPCSeeder,
    private itemSeeder: ItemSeeder,
    private questSeeder: QuestSeeder,
    private characterTextureSeeder: CharacterTexturesSeeder
  ) {}

  public async start(): Promise<void> {
    console.time("🌱 Seeding");
    if (appEnv.general.ENV === EnvType.Development) {
      await this.npcSeeder.seed();
      await this.itemSeeder.seed();
      await this.questSeeder.seed();
      await this.characterTextureSeeder.seed();
    } else {
      // in production we just need one instance
      if (process.env.NODE_APP_INSTANCE === "0") {
        await this.npcSeeder.seed();
        await this.itemSeeder.seed();
        await this.questSeeder.seed();
        await this.characterTextureSeeder.seed();
      }
    }
    console.timeEnd("🌱 Seeding");
  }
}
