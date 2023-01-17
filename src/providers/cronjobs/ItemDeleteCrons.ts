import { Item } from "@entities/ModuleInventory/ItemModel";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { UISocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import nodeCron from "node-cron";

@provide(ItemDeleteCrons)
export class ItemDeleteCrons {
  constructor(private socketMessaging: SocketMessaging) {}

  public schedule(): void {
    nodeCron.schedule("0 0 * * *", () => {
      this.socketMessaging.sendEventToAllUsers(
        UISocketEvents.ShowMessage,
        "Server: Cleaning up items on the floor in 5 min. Please don't drop valuables."
      );

      setTimeout(async () => {
        const items = await Item.find({
          // @ts-ignore
          x: { $ne: null },
          y: { $ne: null },
          scene: { $ne: null },
        });

        for (const item of items) {
          await item.delete();
        }
      }, 60 * 1000 * 5);
    });
  }
}
