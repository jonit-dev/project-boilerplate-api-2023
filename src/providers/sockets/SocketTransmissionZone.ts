import { MathHelper } from "@providers/math/MathHelper";
import { calculateSocketTransmissionZone, ISocketTransmissionZone } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(SocketTransmissionZone)
export class SocketTransmissionZone {
  constructor(private mathHelper: MathHelper) {}

  public calculateSocketTransmissionZone(
    entityX: number,
    entityY: number,
    entityWidth: number,
    entityHeight: number,
    zoneWidth: number,
    zoneHeight: number
  ): ISocketTransmissionZone {
    // example: if zone width is 60 grid cells, we'd have 30 grid cells on each side of the entity as a zone
    return calculateSocketTransmissionZone(entityX, entityY, entityWidth, entityHeight, zoneWidth, zoneHeight);
  }

  public isInsideTransmissionZone(x: number, y: number, transmissionZone: ISocketTransmissionZone): boolean {
    const rectangle = {
      top: transmissionZone.y,
      bottom: transmissionZone.y + transmissionZone.height,
      left: transmissionZone.x,
      right: transmissionZone.x + transmissionZone.width,
    };

    return this.mathHelper.isXYInsideRectangle({ x, y }, rectangle);
  }
}
