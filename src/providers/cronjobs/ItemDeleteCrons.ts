import { Item } from "@entities/ModuleInventory/ItemModel";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { ItemSubType, UISocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import nodeCron from "node-cron";

@provide(ItemDeleteCrons)
export class ItemDeleteCrons {
  constructor(private socketMessaging: SocketMessaging) {}

  public schedule(): void {
    nodeCron.schedule("0 * * * *", () => {
      this.socketMessaging.sendEventToAllUsers(
        UISocketEvents.ShowMessage,
        "Server: Cleaning up items on the floor in 5 min. Please don't drop valuables."
      );

      //! Warning: This is a very dangerous operation. It will delete all items that have a scene, x, and y value. DO NOT use $exists: true here, because it will delete items with a null value for x, y, and scene.
      setTimeout(async () => {
        const items = await Item.find({
          // @ts-ignore
          x: { $ne: null },
          y: { $ne: null },
          scene: { $ne: null },
        });

        for (const item of items) {
          // if item has "body" on its name, dont delete
          if (item.subType === ItemSubType.DeadBody) {
            continue;
          }

          await item.delete();
        }
      }, 60 * 1000 * 5);
    });
  }
}
