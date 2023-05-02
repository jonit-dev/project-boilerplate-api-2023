import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { NPC } from "@entities/ModuleNPC/NPCModel";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import {
  CharacterTradeSocketEvents,
  ICharacterMarketplaceTradeInit,
  ICharacterMarketplaceTradeRequest,
  ICharacterNPCTradeInit,
  ICharacterNPCTradeRequest,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { CharacterTradingNPCBuy } from "../CharacterTradingNPCBuy";
import { CharacterTradingNPCSell } from "../CharacterTradingNPCSell";
import { Marketplace } from "@entities/ModuleMarketplace/MarketplaceModel";
import { CharacterTradingMarketplaceSell } from "../CharacterTradingMarketplaceSell";
import { CharacterTradingMarketplaceBuy } from "../CharacterTradingMarketplaceBuy";

@provide(CharacterNetworkTrading)
export class CharacterNetworkTrading {
  constructor(
    private socketAuth: SocketAuth,
    private characterTradingNPCBuy: CharacterTradingNPCBuy,
    private characterTradingNPCSell: CharacterTradingNPCSell,
    private characterTradingMarketplaceSell: CharacterTradingMarketplaceSell,
    private characterTradingMarketplaceBuy: CharacterTradingMarketplaceBuy,
    private socketMessaging: SocketMessaging
  ) {}

  public onCharacterNPCTrade(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(
      channel,
      CharacterTradeSocketEvents.TradeInit,
      async (data: ICharacterNPCTradeInit, character: ICharacter) => {
        const { npcId, type } = data;

        switch (type) {
          case "buy":
            await this.characterTradingNPCBuy.initializeBuy(npcId, character);
            break;
          case "sell":
            await this.characterTradingNPCSell.initializeSell(npcId, character);
            break;
        }
      }
    );

    this.socketAuth.authCharacterOn(
      channel,
      CharacterTradeSocketEvents.TradeWithNPC,
      async (data: ICharacterNPCTradeRequest, character: ICharacter) => {
        const { npcId, type, items } = data;

        const npc = await NPC.findById(npcId);

        if (!npc) {
          this.socketMessaging.sendErrorMessageToCharacter(
            character,
            "Sorry, the NPC you are trying to trade with is not available."
          );
          return;
        }

        switch (type) {
          case "buy":
            await this.characterTradingNPCBuy.buyItemsFromNPC(character, npc, items);
            break;
          case "sell":
            await this.characterTradingNPCSell.sellItemsToNPC(character, npc, items);
            break;
        }
      }
    );
  }

  public onCharacterMarketplaceTrade(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(
      channel,
      CharacterTradeSocketEvents.MarketplaceTradeInit,
      async (data: ICharacterMarketplaceTradeInit, character: ICharacter) => {
        const { marketplaceId, type } = data;

        switch (type) {
          case "buy":
            await this.characterTradingMarketplaceBuy.initializeBuy(marketplaceId, character);
            break;
          case "sell":
            await this.characterTradingMarketplaceSell.initializeSell(marketplaceId, character);
            break;
        }
      }
    );

    this.socketAuth.authCharacterOn(
      channel,
      CharacterTradeSocketEvents.TradeWithMarketplace,
      async (data: ICharacterMarketplaceTradeRequest, character: ICharacter) => {
        const { marketplaceId, type, items } = data;

        const mp = await Marketplace.findById(marketplaceId);

        if (!mp || !mp.open) {
          this.socketMessaging.sendErrorMessageToCharacter(
            character,
            "Sorry, the Marketplace you are trying to trade with is not available."
          );
          return;
        }

        switch (type) {
          case "buy":
            await this.characterTradingMarketplaceBuy.buyItems(character, mp, items);
            break;
          case "sell":
            await this.characterTradingMarketplaceSell.sellItems(character, items);
            break;
        }
      }
    );
  }
}
