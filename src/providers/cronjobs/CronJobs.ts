import { appEnv } from "@providers/config/env";
import { PM2Helper } from "@providers/server/PM2Helper";
import { EnvType } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { RedisCrons } from "./RedisCrons";

@provide(Cronjob)
export class Cronjob {
  constructor(private pm2Helper: PM2Helper, private redisCrons: RedisCrons) {}

  public start(): void {
    this.scheduleCrons();
  }

  private scheduleCrons(): void {
    console.log("🕒 Start cronjob scheduling...");

    switch (appEnv.general.ENV) {
      case EnvType.Development:
        this.redisCrons.schedule();
        break;
      case EnvType.Staging:
      case EnvType.Production:
        // make sure it only runs in one instance
        if (process.env.pm_id === this.pm2Helper.pickLastCPUInstance()) {
          this.redisCrons.schedule();
        }
        break;
    }
  }
}
