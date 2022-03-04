// @ts-ignore
import { ICharacter } from "@entities/ModuleSystem/CharacterModel";
import { MathHelper } from "@providers/math/MathHelper";
import { PlayerView } from "@providers/player/PlayerView";
import { SocketAdapter } from "@providers/sockets/SocketAdapter";
import { CAMERA_VIEWPORT_WIDTH, GRID_WIDTH, ICameraCoordinates } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(GeckosMessaging)
export class GeckosMessaging {
  constructor(private mathHelper: MathHelper, private playerView: PlayerView, private socketAdapter: SocketAdapter) {}

  public sendEventToUser<T>(userChannel: string, eventName: string, data?: T): void {
    this.socketAdapter.emitToUser(userChannel, eventName, data || {});
  }

  public sendEventToAllUsers<T>(eventName: string, data?: T): void {
    this.socketAdapter.emitToAllUsers(eventName, data || {});
  }

  public async sendMessageToClosePlayers(character: ICharacter, eventName: string, data?: any): Promise<void> {
    const playersNearby = await this.playerView.getCharactersInView(character);

    if (playersNearby) {
      for (const player of playersNearby) {
        console.log(`📨 Sending ${eventName} to ${player.name} (channel: ${player.channelId})`);
        this.sendEventToUser(player.channelId!, eventName, data || {});
      }
    }
  }

  private isUnderPlayerCamera(x: number, y: number, camera: ICameraCoordinates): boolean {
    return this.mathHelper.isXYInsideRectangle(
      { x: x, y: y },
      {
        top: camera.y,
        left: camera.x,
        bottom: camera.height + camera.y,
        right: camera.width + camera.x,
      }
    );
  }

  private isUnderPlayerRange(emitterX: number, emitterY: number, otherX: number, otherY: number): boolean {
    // compare current position with emitter player position
    const distance = this.mathHelper.getDistanceBetweenPoints(emitterX, emitterY, otherX, otherY);

    const distanceThreshold = Math.floor(CAMERA_VIEWPORT_WIDTH / GRID_WIDTH);

    // calculate distance in tiles

    if (distance < distanceThreshold) {
      return true;
    }
    return false;
  }
}
