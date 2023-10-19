import { provide } from "inversify-binding-decorators";
import { SocketChannel } from "./SocketsTypes";

@provide(SocketEventsBinder)
export class SocketEventsBinder {
  constructor() {} // private characterNetwork: CharacterNetwork, //! Leaving this as example of patterns

  public bindEvents(channel: SocketChannel): void {
    // this.characterNetwork.onAddEventListeners(channel); //! same as above
  }
}
