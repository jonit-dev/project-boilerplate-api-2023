import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { NPC } from "@entities/ModuleNPC/NPCModel";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { CharacterTradeSocketEvents, ICharacterNPCTrade } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { CharacterTradingNPCBuy } from "../CharacterTradingNPCBuy";

@provide(CharacterNetworkTrading)
export class CharacterNetworkTrading {
  constructor(
    private socketAuth: SocketAuth,
    private characterTradingNPCBuy: CharacterTradingNPCBuy,
    private socketMessaging: SocketMessaging
  ) {}

  public onCharacterNPCTrade(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(
      channel,
      CharacterTradeSocketEvents.TradeWithNPC,
      async (data: ICharacterNPCTrade, character: ICharacter) => {
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
            break;
        }
      }
    );
  }
}
