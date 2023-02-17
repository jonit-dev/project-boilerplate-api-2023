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
      const droppedItems = await Item.find({ droppedBy: character._id });

      if (droppedItems.length === ITEM_CLEANUP_WARNING_THRESHOLD) {
        this.socketMessaging.sendErrorMessageToCharacter(
          character,
          "Please STOP dropping items on the ground, otherwise your character may get banned."
        );
        return;
      }

      if (droppedItems.length >= ITEM_CLEANUP_THRESHOLD) {
        await this.characterBan.addPenalty(character);

        for (const item of droppedItems) {
          await item.remove();
        }
      }
    }, 1000);
  }
}
