import { Character } from "@entities/ModuleCharacter/CharacterModel";
import { Item } from "@entities/ModuleInventory/ItemModel";
import { NewRelic } from "@providers/analytics/NewRelic";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { NewRelicTransactionCategory } from "@providers/types/NewRelicTypes";
import { IUIShowMessage, UISocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import nodeCron from "node-cron";

@provide(ItemDeleteCrons)
export class ItemDeleteCrons {
  constructor(private socketMessaging: SocketMessaging, private newRelic: NewRelic) {}

  public schedule(): void {
    nodeCron.schedule("0 */1 * * *", async () => {
      await this.newRelic.trackTransaction(NewRelicTransactionCategory.CronJob, "ItemDeleteCrons", async () => {
        const allOnlineCharacters = await Character.find({ isOnline: true }).lean();

        for (const character of allOnlineCharacters) {
          this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
            message: "Server: Cleaning up items on the floor in 5 min. Please don't drop any item!",
            type: "info",
          });
        }

        //! THIS IS ONE OF THE MOST DANGEROUS CRON JOBS ON THE SYSTEM. DO NOT TOUCH THIS SHIT IF YOU DONT KNOW WHAT YOU ARE DOING.

        setTimeout(async () => {
          // query items that are dropped on the scene (x,y,scene), not equipped, are not in a container and has no owner

          const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

          const items = await Item.find({
            // @ts-ignore
            x: { $ne: null },
            y: { $ne: null },
            name: { $ne: "Depot" },
            scene: { $ne: null },
            isEquipped: { $ne: true },
            itemContainer: { $exists: false },
            $or: [{ owner: null }, { owner: { $exists: false } }],
            updatedAt: { $lt: oneHourAgo }, // delete items that are older than 1 hour!
          });

          for (const item of items) {
            await item.remove();
          }
        }, 60 * 1000 * 5);
      });
    });
  }
}
