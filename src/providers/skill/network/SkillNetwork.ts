import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { provide } from "inversify-binding-decorators";
import { SkillNetworkReadInfo } from "./SkillNetworkReadInfo";

@provide(SkillNetwork)
export class SkillNetwork {
  constructor(private skillNetworkReadInfo: SkillNetworkReadInfo) {}

  public onAddEventListeners(channel: SocketChannel): void {
    this.skillNetworkReadInfo.onGetInfo(channel);
  }
}
