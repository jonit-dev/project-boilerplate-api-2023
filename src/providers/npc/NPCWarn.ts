import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { CharacterView } from "@providers/character/CharacterView";
import { PROMISE_DEFAULT_CONCURRENCY } from "@providers/constants/ServerConstants";
import { DataStructureHelper } from "@providers/dataStructures/DataStructuresHelper";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import {
  INPCPositionCreatePayload,
  INPCPositionUpdatePayload,
  NPCAlignment,
  NPCSocketEvents,
} from "@rpg-engine/shared";
import { Promise } from "bluebird";
import { provide } from "inversify-binding-decorators";
import { NPCQuest } from "./NPCQuest";
import { NPCView } from "./NPCView";

export interface IWarnOptions {
  always?: boolean;
}

@provide(NPCWarn)
export class NPCWarn {
  constructor(
    private socketMessaging: SocketMessaging,
    private npcView: NPCView,
    private characterView: CharacterView,
    private objectHelper: DataStructureHelper,
    private npcQuest: NPCQuest
  ) {}

  @TrackNewRelicTransaction()
  public async warnCharacterAboutNPCsInView(character: ICharacter, options?: IWarnOptions): Promise<void> {
    // Fetch all NPCs in view first, before entering loop
    const npcsInView = await this.npcView.getNPCsInView(character);

    const npcWarnings = Promise.map(
      npcsInView,
      async (npc) => {
        if (!options?.always) {
          // Fetch all elements and proceed with object checks
          const npcOnCharView = await this.characterView.getElementOnView(character, npc.id, "npcs");
          if (npcOnCharView) {
            const doesServerNPCMatchesClientNPC = this.objectHelper.doesObjectAttrMatches(npcOnCharView, npc, [
              "id",
              "scene",
            ]);
            if (doesServerNPCMatchesClientNPC) {
              return; // skip
            }
          }
        }
        await this.warnCharacterAboutSingleNPCCreation(npc, character);
      },
      { concurrency: PROMISE_DEFAULT_CONCURRENCY }
    );

    await npcWarnings;
  }

  @TrackNewRelicTransaction()
  public async warnCharacterAboutSingleNPCCreation(npc: INPC, character: ICharacter): Promise<void> {
    await this.characterView.addToCharacterView(
      character._id,
      {
        id: npc._id,
        x: npc.x,
        y: npc.y,
        scene: npc.scene,
      },
      "npcs"
    );

    const hasQuest = await this.npcQuest.hasQuest(npc);

    this.socketMessaging.sendEventToUser<INPCPositionCreatePayload>(
      character.channelId!,
      NPCSocketEvents.NPCPositionCreate,
      {
        id: npc._id,
        name: npc.name,
        x: npc.x,
        y: npc.y,
        direction: npc.direction,
        key: npc.key,
        layer: npc.layer,
        textureKey: npc.textureKey,
        scene: npc.scene,
        speed: npc.speed,
        alignment: npc.alignment as NPCAlignment,
        health: npc.health,
        maxHealth: npc.maxHealth,
        mana: npc.mana,
        maxMana: npc.maxMana,
        hasQuest,
        hasDepot: npc.hasDepot!,
        isTrader: npc.isTrader,
        traderItems: npc.traderItems,
        isGiantForm: npc.isGiantForm,
      }
    );
  }

  public warnCharacterAboutSingleNPCUpdate(npc: INPC, character: ICharacter): void {
    this.socketMessaging.sendEventToUser<INPCPositionUpdatePayload>(
      character.channelId!,
      NPCSocketEvents.NPCPositionUpdate,
      {
        id: npc._id,
        x: npc.x,
        y: npc.y,
        direction: npc.direction,
        alignment: npc.alignment as NPCAlignment,
      }
    );
  }
}
