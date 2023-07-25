import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import {
  CharacterTradeSocketEvents,
  ICharacterNPCTradeInitSellResponse,
  ITradeRequestItem,
  TradingEntity,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { CharacterTarget } from "./CharacterTarget";
import { CharacterTradingBalance } from "./CharacterTradingBalance";
import { CharacterTradingSell } from "./CharacterTradingSell";
import { CharacterTradingValidation } from "./CharacterTradingValidation";
import { CharacterWeight } from "./weight/CharacterWeight";

@provide(CharacterTradingNPCSell)
export class CharacterTradingNPCSell {
  constructor(
    private socketMessaging: SocketMessaging,
    private characterTradingSell: CharacterTradingSell,
    private characterWeight: CharacterWeight,
    private characterTradingValidation: CharacterTradingValidation,
    private characterTradingBalance: CharacterTradingBalance,
    private characterTarget: CharacterTarget
  ) {}

  @TrackNewRelicTransaction()
  public async initializeSell(npcId: string, character: ICharacter): Promise<void> {
    const npc = await this.characterTradingValidation.validateAndReturnTraderNPC(npcId, character);
    if (!npc) {
      return;
    }

    const characterItems = await this.characterTradingSell.getCharacterItemsToSell(character, TradingEntity.NPC);
    if (!characterItems) {
      return;
    }

    const characterAvailableGold = await this.characterTradingBalance.getTotalGoldInInventory(character);

    await this.characterTarget.setFocusOnCharacter(npc, character);

    this.socketMessaging.sendEventToUser<ICharacterNPCTradeInitSellResponse>(
      character.channelId!,
      CharacterTradeSocketEvents.TradeInit,
      {
        npcId: npc._id,
        type: "sell",
        characterItems: characterItems || [],
        characterAvailableGold,
      }
    );
  }

  @TrackNewRelicTransaction()
  public sellItemsToNPC(character: ICharacter, npc: INPC, items: ITradeRequestItem[]): Promise<void> {
    return this.characterTradingSell.sellItems(character, items, TradingEntity.NPC, npc);
  }
}
