// @ts-ignore
import { Data, ServerChannel } from "@geckos.io/server";
import { GeckosAuth } from "@providers/geckos/GeckosAuth";
import { IPlayerPing, PlayerGeckosEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { GeckosServerHelper } from "../geckos/GeckosServerHelper";

@provide(PlayerPing)
export class PlayerPing {
  constructor(private geckosAuth: GeckosAuth) {}

  public onPlayerPing(channel: ServerChannel): void {
    this.geckosAuth.authCharacterOn(channel, PlayerGeckosEvents.PlayerPing, (d: Data) => {
      const payload = d as IPlayerPing;

      console.log(`📨 Received ${PlayerGeckosEvents.PlayerPing}: ${JSON.stringify(payload)}`);

      GeckosServerHelper.connectedPlayers[payload.id].lastActivity = Date.now();
    });
  }
}
