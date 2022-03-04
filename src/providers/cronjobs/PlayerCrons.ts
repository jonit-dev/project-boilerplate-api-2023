import { Character } from "@entities/ModuleSystem/CharacterModel";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { PlayerGeckosEvents } from "@rpg-engine/shared";
import dayjs from "dayjs";
import { provide } from "inversify-binding-decorators";
import nodeCron from "node-cron";

@provide(PlayerCrons)
export class PlayerCrons {
  constructor(private socketMessaging: SocketMessaging) {}

  public schedule(): void {
    nodeCron.schedule("*/10 * * * *", async () => {
      console.log("Checking inactive players...");
      await this.logoutInactivePlayers();
    });
  }

  private async logoutInactivePlayers(): Promise<void> {
    const onlinePlayers = await Character.find({
      isOnline: true,
    });

    for (const player of onlinePlayers) {
      const lastActivity = dayjs(player.updatedAt);
      const now = dayjs();
      const diff = now.diff(lastActivity, "minute");

      if (diff >= 10) {
        console.log(`🚪: Player id ${player.id} has disconnected due to inactivity...`);
        this.socketMessaging.sendEventToUser(player.channelId!, PlayerGeckosEvents.PlayerForceDisconnect);
        this.socketMessaging.sendMessageToClosePlayers(player, PlayerGeckosEvents.PlayerLogout, {
          id: player.id,
        });

        player.isOnline = false;
        await player.save();
      }
    }
  }
}
