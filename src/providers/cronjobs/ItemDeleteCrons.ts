import { Character } from "@entities/ModuleCharacter/CharacterModel";
import { Item } from "@entities/ModuleInventory/ItemModel";
import { NewRelic } from "@providers/analytics/NewRelic";
import { MapHelper } from "@providers/map/MapHelper";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { NewRelicTransactionCategory } from "@providers/types/NewRelicTypes";
import { IUIShowMessage, UISocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import nodeCron from "node-cron";

@provide(ItemDeleteCrons)
export class ItemDeleteCrons {
  constructor(private socketMessaging: SocketMessaging, private newRelic: NewRelic, private mapHelper: MapHelper) {}

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
            //* Items that have COORDINATES
            // @ts-ignore
            x: { $exists: true, $ne: null },
            y: { $exists: true, $ne: null },
            scene: { $exists: true, $ne: null },

            //* And also without an owner
            owner: { $in: [null, undefined] },

            //* Are not equipped
            isEquipped: { $ne: true },

            name: { $ne: "Depot" },
            itemContainer: { $exists: false },

            //* And were manipulated more than an hour ago
            updatedAt: { $lt: oneHourAgo }, // delete items that are older than 1 hour!
          });

          for (const item of items) {
            // lets also double check!
            const isItemOnMap =
              this.mapHelper.isCoordinateValid(item.x) && this.mapHelper.isCoordinateValid(item.y) && item.scene;

            if (!isItemOnMap) {
              continue;
            }

            if (item.owner) {
              continue;
            }

            if (item.isEquipped) {
              continue;
            }

            await item.remove();
          }
        }, 60 * 1000 * 5);
      });
    });
  }
}
