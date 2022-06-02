import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Item } from "@entities/ModuleInventory/ItemModel";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { IGetItemInfo, IReadItemInfo, ItemSocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
@provide(ItemNetworkInfo)
export class ItemNetworkInfo {
  constructor(private socketAuth: SocketAuth, private socketMessaging: SocketMessaging) {}

  public onGetItemInfo(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(
      channel,
      ItemSocketEvents.GetItemInfo,
      async (data: IGetItemInfo, character: ICharacter) => {
        const item = await Item.findById(data.id);
        if (item) {
          for (const field of data.fields) {
            if (item[field] && item[field].length > 1) {
              this.socketMessaging.sendEventToUser<IReadItemInfo>(character.channelId!, ItemSocketEvents.ReadItemInfo, {
                id: item._id,
                information: item[field],
              });
              break;
            }
          }
        }
      }
    );
  }
}
