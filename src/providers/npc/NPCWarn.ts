import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { NewRelic } from "@providers/analytics/NewRelic";
import { CharacterView } from "@providers/character/CharacterView";
import { DataStructureHelper } from "@providers/dataStructures/DataStructuresHelper";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { NewRelicTransactionCategory } from "@providers/types/NewRelicTypes";
import {
  INPCPositionCreatePayload,
  INPCPositionUpdatePayload,
  NPCAlignment,
  NPCSocketEvents,
} from "@rpg-engine/shared";
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
    private npcQuest: NPCQuest,
    private newRelic: NewRelic
  ) {}

  public async warnCharacterAboutNPCsInView(character: ICharacter, options?: IWarnOptions): Promise<void> {
    await this.newRelic.trackTransaction(
      NewRelicTransactionCategory.Operation,
      "NPCWarn.warnCharacterAboutNPCsInView",
      async () => {
        const npcsInView = await this.npcView.getNPCsInView(character);

        for (const npc of npcsInView) {
          if (!options?.always) {
            const npcOnCharView = await this.characterView.getElementOnView(character, npc.id, "npcs");

            // if we already have a representation there, just skip!
            if (npcOnCharView) {
              const doesServerNPCMatchesClientNPC = this.objectHelper.doesObjectAttrMatches(npcOnCharView, npc, [
                "id",
                "scene",
              ]);

              if (doesServerNPCMatchesClientNPC) {
                continue;
              }
            }
          }

          await this.warnCharacterAboutSingleNPCCreation(npc, character);
        }
      }
    );
  }

  public async warnCharacterAboutSingleNPCCreation(npc: INPC, character: ICharacter): Promise<void> {
    await this.newRelic.trackTransaction(
      NewRelicTransactionCategory.Operation,
      "NPCWarn.warnCharacterAboutSingleNPCCreation",
      async () => {
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
