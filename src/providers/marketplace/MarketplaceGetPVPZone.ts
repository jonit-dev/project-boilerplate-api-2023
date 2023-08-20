import { Character } from "@entities/ModuleCharacter/CharacterModel";
import { MapNonPVPZone } from "@providers/map/MapNonPVPZone";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { MarketplaceSocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(MarketplaceGetPVPZone)
export class MarketplaceGetPVPZone {
  constructor(private socketMessaging: SocketMessaging, private mapNonPVPZone: MapNonPVPZone) {}

  public async isNonPVPZone(characterId: string): Promise<void> {
    const character = await Character.findById(characterId);
    if (!character) {
      console.error(`Character not found with ID: ${characterId}`);
      return;
    }

    const isNonPVPZone = this.mapNonPVPZone.isNonPVPZoneAtXY(character.scene, character.x, character.y);
    if (isNonPVPZone) {
      this.socketMessaging.sendEventToUser(character.channelId!, MarketplaceSocketEvents.GetNonPVPZone, {
        isNonPVPZone,
      });
    } else {
      this.socketMessaging.sendErrorMessageToCharacter(
        character,
        "Sorry, you must be in a protected zone to use the marketplace"
      );
    }
  }
}
