import { ICharacter } from "@entities/ModuleSystem/CharacterModel";
import { INPC, NPC } from "@entities/ModuleSystem/NPCModel";
import { PlayerView } from "@providers/player/PlayerView";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { INPCPositionUpdatePayload, NPCSocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(NPCView)
export class NPCView {
  constructor(private socketMessaging: SocketMessaging, private playerView: PlayerView) {}

  public async warnUserAboutNPCsInView(character: ICharacter): Promise<void> {
    const npcsInView = await this.getNPCsInView(character);

    for (const npc of npcsInView) {
      this.socketMessaging.sendEventToUser<INPCPositionUpdatePayload>(
        character.channelId!,
        NPCSocketEvents.NPCPositionUpdate,
        {
          id: npc.id,
          name: npc.name,
          x: npc.x,
          y: npc.y,
          direction: npc.direction,
          key: npc.key,
          layer: npc.layer,
          textureKey: npc.textureKey,
        }
      );
    }
  }

  public async getNPCsInView(character: ICharacter): Promise<INPC[]> {
    const npcsInView = await this.playerView.getElementsInCharView(NPC, character);

    return npcsInView;
  }
}
