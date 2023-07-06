import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { blueprintManager } from "@providers/inversify/container";
import { AvailableBlueprints } from "@providers/item/data/types/itemsBlueprintTypes";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import {
  CharacterTradeSocketEvents,
  ICharacterNPCTradeInitBuyResponse,
  ITradeRequestItem,
  ITradeResponseItem,
  TradingEntity,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { CharacterTarget } from "./CharacterTarget";
import { CharacterTradingBalance } from "./CharacterTradingBalance";
import { CharacterTradingBuy } from "./CharacterTradingBuy";
import { CharacterTradingValidation } from "./CharacterTradingValidation";

@provide(CharacterTradingNPCBuy)
export class CharacterTradingNPCBuy {
  constructor(
    private socketMessaging: SocketMessaging,
    private characterTradingBalance: CharacterTradingBalance,
    private characterTradingBuy: CharacterTradingBuy,
    private characterTradingValidation: CharacterTradingValidation,
    private characterTarget: CharacterTarget
  ) {}

  @TrackNewRelicTransaction()
  public async initializeBuy(npcId: string, character: ICharacter): Promise<void> {
    const npc = await this.characterTradingValidation.validateAndReturnTraderNPC(npcId, character);

    if (!npc) {
      throw new Error("Failed to initialize buy transaction. NPC not found!");
    }

    const traderItems: ITradeResponseItem[] = [];

    npc?.traderItems?.forEach(async ({ key }) => {
      const item = await blueprintManager.getBlueprint<any>("items", key as AvailableBlueprints);
      const price = await this.characterTradingBalance.getItemBuyPrice(key);

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

  @TrackNewRelicTransaction()
  public buyItemsFromNPC(character: ICharacter, npc: INPC, items: ITradeRequestItem[]): Promise<boolean> {
    return this.characterTradingBuy.buyItems(character, npc, items, TradingEntity.NPC);
  }
}
