import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { MarketplaceSocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { MarketplaceGetPVPZone } from "../MarketplaceGetPVPZone";

@provide(MarketplaceGetPVPZoneNetwork)
export class MarketplaceGetPVPZoneNetwork {
  constructor(private socketAuth: SocketAuth, private marketplaceGetPVPZone: MarketplaceGetPVPZone) {}

  public onGetPVPZone(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(channel, MarketplaceSocketEvents.GetNonPVPZone, async (character) => {
      try {
        await this.marketplaceGetPVPZone.isNonPVPZone(character.socketCharId);
      } catch (error) {
        console.error(`Error checking non-PVP zone for character ${character.socketCharId}: ${error}`);
      }
    });
  }
}
