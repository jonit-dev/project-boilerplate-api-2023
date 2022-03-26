import { appEnv } from "@providers/config/env";
import { EnvType } from "@rpg-engine/shared/dist";
import { provide } from "inversify-binding-decorators";
import { CharacterCrons } from "./CharacterCrons";

@provide(Cronjob)
class Cronjob {
  constructor(private characterCron: CharacterCrons) {}

  public start(): void {
    this.scheduleCrons();
  }

  private scheduleCrons(): void {
    console.log("🕒 Start cronjob scheduling...");

    if (appEnv.general.ENV === EnvType.Production) {
      switch (process.env.pm_id) {
        case "0":
          this.characterCron.schedule();
          break;
        case "1":
          break;
        case "2":
          break;
        case "3":
          break;
      }
    } else {
      this.characterCron.schedule();
    }
  }
}

export { Cronjob };
