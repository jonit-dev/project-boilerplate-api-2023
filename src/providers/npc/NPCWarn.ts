import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { CharacterView } from "@providers/character/CharacterView";
import { DataStructureHelper } from "@providers/dataStructures/DataStructuresHelper";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { INPCPositionUpdatePayload, NPCAlignment, NPCSocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { NPCView } from "./NPCView";

@provide(NPCWarn)
export class NPCWarn {
  constructor(
    private socketMessaging: SocketMessaging,
    private npcView: NPCView,
    private characterView: CharacterView,
    private objectHelper: DataStructureHelper
  ) {}

  public async warnCharacterAboutNPCsInView(character: ICharacter): Promise<void> {
    const npcsInView = await this.npcView.getNPCsInView(character);

    for (const npc of npcsInView) {
      const npcOnCharView = character.view.npcs[npc.id];

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

      await this.characterView.addToCharacterView(
        character,
        {
          id: npc.id,
          x: npc.x,
          y: npc.y,
          scene: npc.scene,
        },
        "npcs"
      );

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
          scene: npc.scene,
          speed: npc.speed,
          alignment: npc.alignment as NPCAlignment,
          health: npc.health,
          maxHealth: npc.maxHealth,
          mana: npc.mana,
          maxMana: npc.maxMana,
          hasQuest: await npc.hasQuest,
        }
      );
    }
  }
}
