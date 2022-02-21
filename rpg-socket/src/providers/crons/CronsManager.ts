import { provide } from "inversify-binding-decorators";
import { PlayerCrons } from "./PlayerCrons";

@provide(CronsManager)
export class CronsManager {
  constructor(private playerCrons: PlayerCrons) {}

  public scheduleAllCrons() {
    this.playerCrons.schedule();
  }
}
