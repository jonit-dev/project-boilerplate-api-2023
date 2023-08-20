import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { IMarketplaceWithdrawMoney, MarketplaceSocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { MarketplaceMoneyWithdraw } from "../MarketplaceMoneyWithdraw";

@provide(MarketplaceMoneyWithdrawNetwork)
export class MarketplaceMoneyWithdrawNetwork {
  constructor(private socketAuth: SocketAuth, private marketplaceMoneyWithdraw: MarketplaceMoneyWithdraw) {}

  public onMoneyWithdraw(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(
      channel,
      MarketplaceSocketEvents.WithdrawMoney,
      async ({ npcId }: IMarketplaceWithdrawMoney, character) => {
        await this.marketplaceMoneyWithdraw.withdrawMoneyFromMarketplace(character, npcId);
      }
    );

    this.socketAuth.authCharacterOn(channel, MarketplaceSocketEvents.GetAvailableMoney, async (_, character) => {
      await this.marketplaceMoneyWithdraw.getAvailableMoney(character);
    });
  }
}
