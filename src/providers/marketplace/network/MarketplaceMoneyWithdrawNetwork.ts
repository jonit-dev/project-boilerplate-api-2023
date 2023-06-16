import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { provide } from "inversify-binding-decorators";
import { MarketplaceMoneyWithdraw } from "../MarketplaceMoneyWithdraw";
import { IMarketplaceWithdrawMoney, MarketplaceSocketEvents } from "@rpg-engine/shared";

@provide(MarketplaceMoneyWithdrawNetwork)
export class MarketplaceMoneyWithdrawNetwork {
  constructor(private socketAuth: SocketAuth, private marketplaceMoneyWithdraw: MarketplaceMoneyWithdraw) {}

  public onMoneyWithdraw(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(
      channel,
      MarketplaceSocketEvents.WithdrawMoney,
      async ({ npcId }: IMarketplaceWithdrawMoney, character) => {
        this.marketplaceMoneyWithdraw.withdrawMoneyFromMarketplace(character, npcId);
      }
    );

    this.socketAuth.authCharacterOn(channel, MarketplaceSocketEvents.GetAvailableMoney, async (_, character) => {
      this.marketplaceMoneyWithdraw.getAvailableMoney(character);
    });
  }
}
