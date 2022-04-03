import { Character } from "@entities/ModuleCharacter/CharacterModel";
// @ts-ignore
import { ServerChannel } from "@geckos.io/server";
import { provide } from "inversify-binding-decorators";
import { CharacterNetworkCreate } from "./CharacterNetworkCreate";
import { CharacterNetworkLogout } from "./CharacterNetworkLogout";
import { CharacterNetworkPing } from "./CharacterNetworkPing";
import { CharacterNetworkUpdate } from "./CharacterNetworkUpdate";

@provide(CharacterNetwork)
export class CharacterNetwork {
  constructor(
    private characterCreate: CharacterNetworkCreate,
    private characterLogout: CharacterNetworkLogout,
    private characterUpdate: CharacterNetworkUpdate,
    private characterPing: CharacterNetworkPing
  ) {}

  public onAddEventListeners(channel: ServerChannel): void {
    this.characterCreate.onCharacterCreate(channel);
    this.characterLogout.onCharacterLogout(channel);
    this.characterUpdate.onCharacterUpdatePosition(channel);
    this.characterPing.onCharacterPing(channel);
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
