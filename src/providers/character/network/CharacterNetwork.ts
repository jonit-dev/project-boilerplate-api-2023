import { SocketChannel } from "@providers/sockets/SocketsTypes";
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

  public onAddEventListeners(channel: SocketChannel): void {
    this.characterCreate.onCharacterCreate(channel);
    this.characterLogout.onCharacterLogout(channel);
    this.characterUpdate.onCharacterUpdatePosition(channel);
    this.characterPing.onCharacterPing(channel);
  }
}
