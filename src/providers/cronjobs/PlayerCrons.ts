import { GeckosMessaging } from "@providers/geckos/GeckosMessaging";
import { GeckosServerHelper } from "@providers/geckos/GeckosServerHelper";
import { PlayerGeckosEvents } from "@rpg-engine/shared";
import dayjs from "dayjs";
import { provide } from "inversify-binding-decorators";
import _ from "lodash";
import nodeCron from "node-cron";

@provide(PlayerCrons)
export class PlayerCrons {
  constructor(private geckosMessaging: GeckosMessaging) {}

  public schedule(): void {
    nodeCron.schedule("*/10 * * * *", () => {
      console.log("Checking inactive players...");
      this.logoutInactivePlayers();
    });
  }

  private logoutInactivePlayers(): void {
    for (const [, playerData] of Object.entries(GeckosServerHelper.connectedPlayers)) {
      const lastActivity = dayjs(playerData.lastActivity);
      const now = dayjs();
      const diff = now.diff(lastActivity, "minute");

      if (diff >= 10) {
        console.log(`🚪: Player id ${playerData.id} has disconnected due to inactivity...`);
        this.geckosMessaging.sendEventToUser(playerData.channelId, PlayerGeckosEvents.PlayerForceDisconnect);
        this.geckosMessaging.sendMessageToClosePlayers(playerData.id, PlayerGeckosEvents.PlayerLogout, {
          id: playerData.id,
        });
        GeckosServerHelper.connectedPlayers = _.omit(GeckosServerHelper.connectedPlayers, playerData.id);
      }
    }
  }
}
