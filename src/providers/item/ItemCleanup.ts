import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Item } from "@entities/ModuleInventory/ItemModel";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { provide } from "inversify-binding-decorators";

import { appEnv } from "@providers/config/env";
import { ITEM_CLEANUP_THRESHOLD, ITEM_CLEANUP_WARNING_THRESHOLD } from "@providers/constants/ItemConstants";
import { CharacterBan } from "../character/CharacterBan";

@provide(ItemCleanup)
export class ItemCleanup {
  constructor(private socketMessaging: SocketMessaging, private characterBan: CharacterBan) {}

  public tryCharacterDroppedItemsCleanup(character: ICharacter): void {
    if (appEnv.general.IS_UNIT_TEST) return;

    setTimeout(async () => {
      const totalDroppedItems = await Item.countDocuments({ droppedBy: character._id });

      if (totalDroppedItems === ITEM_CLEANUP_WARNING_THRESHOLD) {
        this.socketMessaging.sendErrorMessageToCharacter(
          character,
          "Please STOP dropping items on the ground, otherwise your character may get banned."
        );
        return;
      }

      if (totalDroppedItems < ITEM_CLEANUP_THRESHOLD) return;

      const lastDroppedItem = await Item.findOne({ droppedBy: character._id }).sort({ createdAt: 1 }).limit(1);

      if (lastDroppedItem) {
        await lastDroppedItem.remove();
      }
    }, 1000);
  }
}
