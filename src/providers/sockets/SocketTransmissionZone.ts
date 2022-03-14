import { provide } from "inversify-binding-decorators";

export interface ISocketTransmissionZone {
  left: number;
  top: number;
  right: number;
  bottom: number;
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
    return {
      left: entityX - zoneWidth / 2 + entityWidth * 0.5,
      top: entityY - zoneHeight / 2 + entityHeight * 0.5,
      right: entityX + zoneWidth / 2 - entityWidth * 0.5,
      bottom: entityY + zoneHeight / 2 - entityHeight * 0.5,
    };
  }
}
