//@ts-ignore
import { Data, ServerChannel } from "@geckos.io/server";
import { IPlayerPing, PlayerGeckosEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { GeckosServerHelper } from "../geckos/GeckosServerHelper";

@provide(PlayerPing)
export class PlayerPing {
  public onPlayerPing(channel: ServerChannel) {
    channel.on(PlayerGeckosEvents.PlayerPing, (d: Data) => {
      const payload = d as IPlayerPing;

      console.log(`📨 Received ${PlayerGeckosEvents.PlayerPing}: ${JSON.stringify(payload)}`);

      GeckosServerHelper.connectedPlayers[payload.id].lastActivity = Date.now();
    });
  }
}
