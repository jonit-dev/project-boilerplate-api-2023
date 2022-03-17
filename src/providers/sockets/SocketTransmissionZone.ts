import { provide } from "inversify-binding-decorators";

export interface ISocketTransmissionZone {
  x: number;
  y: number;
  width: number;
  height: number;
}

@provide(SocketTransmissionZone)
export class SocketTransmissionZone {
  public calculateSocketTransmissionZone(
    entityX: number,
    entityY: number,
    entityWidth: number,
    entityHeight: number,
    zoneWidth: number,
    zoneHeight: number
  ): ISocketTransmissionZone {
    // example: if zone width is 60 grid cells, we'd have 30 grid cells on each side of the entity as a zone
    return {
      x: entityX - zoneWidth / 2 + entityWidth / 2,
      y: entityY - zoneHeight / 2 + entityHeight / 2,
      width: entityX + zoneWidth / 2 - entityWidth / 2,
      height: entityY + zoneHeight / 2 - entityHeight / 2,
    };
  }
}
