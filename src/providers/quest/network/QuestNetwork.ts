import { QuestNetworkChoose } from "@providers/quest/network/QuestNetworkChoose";
import { QuestNetworkGet } from "@providers/quest/network/QuestNetworkGet";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { provide } from "inversify-binding-decorators";

@provide(QuestNetwork)
export class QuestNetwork {
  constructor(private getQuests: QuestNetworkGet, private chooseQuest: QuestNetworkChoose) {}

  public onAddEventListeners(channel: SocketChannel): void {
    this.getQuests.onGetQuests(channel);
    this.chooseQuest.onChooseQuest(channel);
  }
}
