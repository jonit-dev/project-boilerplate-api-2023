import { ICharacter } from "@entities/ModuleSystem/CharacterModel";
import { INPC, NPC } from "@entities/ModuleSystem/NPCModel";
import { appEnv } from "@providers/config/env";
import { PlayerView } from "@providers/player/PlayerView";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import {
  EnvType,
  FixedPathOrientation,
  INPCPositionUpdatePayload,
  NPCMovementType,
  NPCSocketEvents,
  SocketTypes,
  ToGridX,
  ToGridY,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import _ from "lodash";
import { NPCMovement } from "./NPCMovement";
import { NPCLoader } from "./npcs/NPCLoader";

@provide(NPCManager)
export class NPCManager {
  constructor(
    private socketMessaging: SocketMessaging,
    private npcMovement: NPCMovement,
    private playerView: PlayerView
  ) {}

  public async init(): Promise<void> {
    const npcs = await NPC.find({});
    switch (appEnv.general.ENV) {
      case EnvType.Development: // on development, start all NPCs at once.
        for (const npc of npcs) {
          this.startBehaviorLoop(npc);
        }
        break;

      case EnvType.Production: // on production, spread NPCs over pm2 instances.
        switch (appEnv.socket.type) {
          case SocketTypes.TCP:
            for (const npc of npcs) {
              if (process.env.NODE_APP_INSTANCE === npc.pm2InstanceManager.toString()) {
                this.startBehaviorLoop(npc);
              }
            }
            break;

          case SocketTypes.UDP:
            if (process.env.NODE_APP_INSTANCE === "0") {
              for (const npc of npcs) {
                this.startBehaviorLoop(npc);
              }
            }
            break;
        }

        break;
    }
  }

  public startBehaviorLoop(npc: INPC): void {
    setInterval(async () => {
      try {
        switch (npc.movementType) {
          case NPCMovementType.Random:
            await this.npcMovement.startRandomMovement(npc);
            break;
          case NPCMovementType.FixedPath:
            let endGridX = npc.fixedPath.endGridX as unknown as number;
            let endGridY = npc.fixedPath.endGridY as unknown as number;
            const npcData = NPCLoader.NPCMetaData.get(npc.key);

            if (!npcData) {
              console.log(`Failed to find NPC data for ${npc.key}`);
              return;
            }

            // if NPC is at the initial position, move forward to end position.
            if (this.npcMovement.isNPCAtPathPosition(npc, ToGridX(npcData.x!), ToGridY(npcData.y!))) {
              npc.fixedPathOrientation = FixedPathOrientation.Forward;
              await npc.save();
            }

            // if NPC is at the end of the path, move backwards to initial position.
            if (this.npcMovement.isNPCAtPathPosition(npc, endGridX, endGridY)) {
              npc.fixedPathOrientation = FixedPathOrientation.Backward;
              await npc.save();
            }

            if (npc.fixedPathOrientation === FixedPathOrientation.Backward) {
              endGridX = ToGridX(npcData?.x!);
              endGridY = ToGridY(npcData?.y!);
            }

            await this.npcMovement.startFixedPathMovement(npc, endGridX, endGridY);

            break;
        }
      } catch (err) {
        console.log(`Error in ${npc.key}`);
        console.log(err);
      }
    }, _.random(1000, 2000));
  }

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
