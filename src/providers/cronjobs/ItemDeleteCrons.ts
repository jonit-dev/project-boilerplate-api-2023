import { Character } from "@entities/ModuleCharacter/CharacterModel";
import { Item } from "@entities/ModuleInventory/ItemModel";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { IUIShowMessage, ItemSubType, UISocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import nodeCron from "node-cron";

@provide(ItemDeleteCrons)
export class ItemDeleteCrons {
  constructor(private socketMessaging: SocketMessaging) {}

  public schedule(): void {
    nodeCron.schedule("0 * * * *", async () => {
      const allOnlineCharacters = await Character.find({ isOnline: true });

      for (const character of allOnlineCharacters) {
        this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
          message: "Server: Cleaning up items on the floor in 5 min. Please don't drop any item!",
          type: "info",
        });
      }

      setTimeout(async () => {
        const items = await Item.find({
          // @ts-ignore
          x: { $ne: null },
          y: { $ne: null },
          scene: { $ne: null },
          subType: { $ne: ItemSubType.DeadBody },
        });

        for (const item of items) {
          await item.remove();
        }
      }, 60 * 1000 * 5);
    });
  }
}
