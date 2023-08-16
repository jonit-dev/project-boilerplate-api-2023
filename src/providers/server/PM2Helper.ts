import pm2 from "@socket.io/pm2";
import { provide } from "inversify-binding-decorators";
import random from "lodash/random";
import os from "os";

import pm2Config from "../../../pm2.json";

@provide(PM2Helper)
export class PM2Helper {
  public getPm2TotalInstances(): number {
    return Number(pm2Config.apps[0].instances) || this.getTotalAvailableCPUs();
  }

  public getTotalAvailableCPUs(): number {
    return os.cpus().length;
  }

  public pickRandomCPUInstance(): string {
    const totalCPUs = this.getPm2TotalInstances();

    return random(0, totalCPUs - 1).toString();
  }

  public pickLastCPUInstance(): string {
    const totalCPUs = this.getPm2TotalInstances();

    if (totalCPUs === 1) return "0";

    return (totalCPUs - 1).toString();
  }

  public sendEventToRandomCPUInstance(event: string, data: any): void {
    const instance = this.pickRandomCPUInstance();

    pm2.sendDataToProcessId(
      Number(instance),
      {
        type: event,
        data,
        topic: "npc",
      },
      function (err, res) {
        if (err) {
          console.log(err);
        }
      }
    );
  }
}
