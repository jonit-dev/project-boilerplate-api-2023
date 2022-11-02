import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { OthersBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { IItemContainer, ItemSocketEvents, ITradeRequestItem } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { CharacterItemContainer } from "./characterItems/CharacterItemContainer";
import { CharacterItemInventory } from "./characterItems/CharacterItemInventory";
import { CharacterTradingBalance } from "./CharacterTradingBalance";
import { CharacterTradingValidation } from "./CharacterTradingValidation";
import { CharacterWeight } from "./CharacterWeight";

@provide(CharacterTradingNPCSell)
export class CharacterTradingNPCSell {
  constructor(
    private socketMessaging: SocketMessaging,
    private characterTradingBalance: CharacterTradingBalance,
    private characterItemContainer: CharacterItemContainer,
    private characterItemInventory: CharacterItemInventory,
    private characterWeight: CharacterWeight,
    private characterTradingValidation: CharacterTradingValidation
  ) {}

  public async sellItemsToNPC(character: ICharacter, npc: INPC, items: ITradeRequestItem[]): Promise<boolean> {
    const isValid = await this.characterTradingValidation.validateSellTransaction(character, npc, items);

    if (!isValid) {
      return false;
    }

    return true;
  }
}
