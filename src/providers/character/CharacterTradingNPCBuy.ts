import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import Shared, {
  CharacterTradeSocketEvents,
  ICharacterNPCTradeInitBuyResponse,
  ITradeRequestItem,
  ITradeResponseItem,
  TradingEntity,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { CharacterTarget } from "./CharacterTarget";
import { CharacterTradingBalance } from "./CharacterTradingBalance";
import { CharacterTradingValidation } from "./CharacterTradingValidation";
import { CharacterTradingBuy } from "./CharacterTradingBuy";

@provide(CharacterTradingNPCBuy)
export class CharacterTradingNPCBuy {
  constructor(
    private socketMessaging: SocketMessaging,
    private characterTradingBalance: CharacterTradingBalance,
    private characterTradingBuy: CharacterTradingBuy,
    private characterTradingValidation: CharacterTradingValidation,
    private characterTarget: CharacterTarget
  ) {}

  public async initializeBuy(npcId: string, character: ICharacter): Promise<void> {
    const npc = await this.characterTradingValidation.validateAndReturnTraderNPC(npcId, character);

    if (!npc) {
      throw new Error("Failed to initialize buy transaction. NPC not found!");
    }

    const traderItems: ITradeResponseItem[] = [];

    npc?.traderItems?.forEach(({ key }) => {
      const item = itemsBlueprintIndex[key] as Shared.IItem;
      const price = this.characterTradingBalance.getItemBuyPrice(key);

      if (price) {
        traderItems.push({ ...item, price });
      }
    });

    const characterAvailableGold = await this.characterTradingBalance.getTotalGoldInInventory(character);

    // change NPC movement type to stopped
    await this.characterTarget.setFocusOnCharacter(npc, character);

    this.socketMessaging.sendEventToUser<ICharacterNPCTradeInitBuyResponse>(
      character.channelId!,
      CharacterTradeSocketEvents.TradeInit,
      {
        npcId: npc._id,
        type: "buy",
        traderItems: traderItems,
        characterAvailableGold,
      }
    );
  }

  public buyItemsFromNPC(character: ICharacter, npc: INPC, items: ITradeRequestItem[]): Promise<boolean> {
    return this.characterTradingBuy.buyItems(character, npc, items, TradingEntity.NPC);
  }
}
