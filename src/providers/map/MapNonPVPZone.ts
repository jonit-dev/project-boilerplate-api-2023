import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { MapSocketEvents, mathHelper } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { MapLoader } from "./MapLoader";
import { MapObjectsLoader } from "./MapObjectsLoader";

@provide(MapNonPVPZone)
export class MapNonPVPZone {
  constructor(private mapObjectsLoader: MapObjectsLoader, private socketMessaging: SocketMessaging) {}

  public stopCharacterAttack(character: ICharacter): void {
    // send event to client telling it to stop any pvp combat in action.
    this.socketMessaging.sendEventToUser(character.channelId!, MapSocketEvents.NonPVPZone);
  }

  public getNonPVPZoneAtXY(mapName: string, x: number, y: number): boolean | undefined {
    const map = MapLoader.maps.get(mapName);

    if (!map) {
      throw new Error(`MapNonPVPZone: Map "${mapName}" is not found!`);
    }
    const nonPVPZones = this.mapObjectsLoader.getObjectLayerData("NonPVPZones", map);

    if (!nonPVPZones) {
      return false;
    }

    for (const nonPVPZone of nonPVPZones) {
      const isOnNonPVPZone = mathHelper.isXYInsideRectangle(
        {
          x: x,
          y: y,
        },
        {
          top: nonPVPZone.y!,
          left: nonPVPZone.x!,
          bottom: nonPVPZone.y! + nonPVPZone.height!,
          right: nonPVPZone.x! + nonPVPZone.width!,
        }
      );

      if (isOnNonPVPZone) {
        return isOnNonPVPZone;
      }
    }
  }
}
