import { SocketAdapter } from "@providers/sockets/SocketAdapter";
import { provide } from "inversify-binding-decorators";

@provide(SocketMessaging)
export class SocketMessaging {
  constructor(private socketAdapter: SocketAdapter) {}

  public sendEventToUser<T>(userChannel: string, eventName: string, data?: T): void {
    void this.socketAdapter.emitToUser(userChannel, eventName, data || {});
  }

  //! Careful with the method! This sends an event to ALL USERS ON THE SERVER!
  public sendEventToAllUsers<T>(eventName: string, data?: T): void {
    this.socketAdapter.emitToAllUsers(eventName, data || {});
  }
}
