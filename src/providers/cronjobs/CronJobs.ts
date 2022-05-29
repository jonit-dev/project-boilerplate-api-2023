import { appEnv } from "@providers/config/env";
import { EnvType } from "@rpg-engine/shared/dist";
import { provide } from "inversify-binding-decorators";
import { CharacterCrons } from "./CharacterCrons";
import { ChatLogCrons } from "./ChatLogCrons";
import { ItemCrons } from "./ItemCrons";

@provide(Cronjob)
export class Cronjob {
  constructor(private characterCron: CharacterCrons, private itemCrons: ItemCrons, private chatLogCron: ChatLogCrons) {}

  public start(): void {
    this.scheduleCrons();
  }

  private scheduleCrons(): void {
    console.log("🕒 Start cronjob scheduling...");

    switch (appEnv.general.ENV) {
      case EnvType.Production:
      case EnvType.Staging:
        switch (
          process.env.pm_id // spread across pm2 clusters to balance workload
        ) {
          case "0":
            this.characterCron.schedule();
            break;
          case "1":
            this.chatLogCron.schedule();
            break;
          case "2":
            this.itemCrons.schedule();
            break;
          case "3":
            break;
        }
        break;
      case EnvType.Development:
      default:
        this.characterCron.schedule();
        this.itemCrons.schedule();
        this.chatLogCron.schedule();
        break;
    }
  }
}
