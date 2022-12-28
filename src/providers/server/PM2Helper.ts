import { provide } from "inversify-binding-decorators";
import random from "lodash/random";
import os from "os";

@provide(PM2Helper)
export class PM2Helper {
  public getTotalCPUs(): number {
    return os.cpus().length;
  }

  public pickRandomCPUInstance(): string {
    const totalCPUs = this.getTotalCPUs();

    return random(0, totalCPUs - 1).toString();
  }
}
