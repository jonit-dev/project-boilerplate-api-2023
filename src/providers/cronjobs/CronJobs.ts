import { appEnv } from "@providers/config/env";
import { EnvType } from "@rpg-engine/shared/dist";
import { provide } from "inversify-binding-decorators";
import { CharacterCrons } from "./CharacterCrons";
import { ItemCrons } from "./ItemCrons";

@provide(Cronjob)
class Cronjob {
  constructor(private characterCron: CharacterCrons, private itemCrons: ItemCrons) {}

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
          this.itemCrons.schedule();
          break;
        case "3":
          break;
      }
    } else {
      this.characterCron.schedule();
      this.itemCrons.schedule();
    }
  }
}

export { Cronjob };
