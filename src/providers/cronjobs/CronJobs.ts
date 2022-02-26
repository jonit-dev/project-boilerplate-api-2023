import { appEnv } from "@providers/config/env";
import { EnvType } from "@rpg-engine/shared/dist";
import { provide } from "inversify-binding-decorators";
import { PlayerCrons } from "./PlayerCrons";
@provide(Cronjob)
class Cronjob {
  constructor(private playerCron: PlayerCrons) {}

  public start(): void {
    this.scheduleCrons();
  }

  private scheduleCrons(): void {
    console.log("🕒 Start cronjob scheduling...");

    if (appEnv.general.ENV === EnvType.Production) {
      switch (process.env.pm_id) {
        case "0":
          this.playerCron.schedule();
          break;
        case "1":
          break;
        case "2":
          break;
        case "3":
          break;
      }
    } else {
      this.playerCron.schedule();
    }
  }
}

export { Cronjob };
