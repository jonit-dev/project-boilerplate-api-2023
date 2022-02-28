import { Character } from "@entities/ModuleSystem/CharacterModel";
// @ts-ignore
import { ServerChannel } from "@geckos.io/server";
import { provide } from "inversify-binding-decorators";
import { PlayerCreate } from "./PlayerCreate";
import { PlayerLogout } from "./PlayerLogout";
import { PlayerPing } from "./PlayerPing";
import { PlayerUpdate } from "./PlayerUpdate";

@provide(Player)
export class Player {
  constructor(
    private playerCreate: PlayerCreate,
    private playerLogout: PlayerLogout,
    private playerUpdate: PlayerUpdate,
    private playerPing: PlayerPing
  ) {}

  public onAddEventListeners(channel: ServerChannel): void {
    // This runs once the server is fully started and ready to accept connections.

    this.playerCreate.onPlayerCreate(channel);
    this.playerLogout.onPlayerLogout(channel);
    this.playerUpdate.onPlayerUpdatePosition(channel);
    this.playerPing.onPlayerPing(channel);
  }

  public async setAllCharactersAsOffline(): Promise<void> {
    await Character.updateMany(
      {},
      {
        $set: {
          isOnline: false,
        },
      }
    );
  }
}
