import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { provide } from "inversify-binding-decorators";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { BasicCharacterValidation } from "@providers/character/validation/BasicCharacterValidation";
import { ItemValidation } from "./validation/ItemValidation";
import { IUIShowMessage, UIMessageType, UISocketEvents } from "@rpg-engine/shared";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";

@provide(ItemUse)
export class ItemUse {
  constructor(
    private basicCharacterValidation: BasicCharacterValidation,
    private itemValidation: ItemValidation,
    private socketMessaging: SocketMessaging
  ) {}

  public async performItemUse(itemUse: any, character: ICharacter): Promise<boolean> {
    if (!this.basicCharacterValidation.isCharacterValid(character)) {
      return false;
    }

    const isItemInCharacterInventory = await this.itemValidation.isItemInCharacterInventory(character, itemUse.itemId);
    if (!isItemInCharacterInventory) {
      return false;
    }

    const useItem = (await Item.findById(itemUse.itemId)) as IItem;

    if (!useItem) {
      this.sendCustomErrorMessage(character, "Sorry, this item is not accessible.");
      return false;
    }

    const bluePrintItem = itemsBlueprintIndex[useItem.key];
    if (!bluePrintItem || !bluePrintItem.useEffect) {
      this.sendCustomErrorMessage(character, "Sorry, this item is not accessible.");
      return false;
    }

    return true;
  }

  private sendCustomErrorMessage(character: ICharacter, message: string, type: UIMessageType = "error"): void {
    this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
      message,
      type,
    });
  }
}
