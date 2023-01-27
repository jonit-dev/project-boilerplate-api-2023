/* eslint-disable no-undef */
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { provideSingleton } from "@providers/inversify/provideSingleton";
import random from "lodash/random";
import { NPC_BATTLE_CYCLES } from "./NPCBattleCycle";
import { NPC_CYCLES } from "./NPCCycle";
import { NPCView } from "./NPCView";

@provideSingleton(NPCFreezer)
export class NPCFreezer {
  public freezeCheckIntervals: Map<string, NodeJS.Timeout> = new Map();

  constructor(private npcView: NPCView) {}

  public tryToFreezeNPC(npc: INPC): void {
    if (this.freezeCheckIntervals.has(npc.id)) {
      return; // interval is already, running, lets not create another one!
    }

    // every 5-10 seconds, check if theres a character nearby. If not, shut down NPCCycle.
    const checkRange = random(3000, 10000);

    const interval = setInterval(async () => {
      const shouldFreezeNPC = await this.shouldFreezeNPC(npc);

      if (!shouldFreezeNPC) {
        return;
      }

      console.log(`Freezing NPC ${npc.key} (${npc.id})`);

      await this.freezeNPC(npc);

      clearInterval(interval);
    }, checkRange);

    this.freezeCheckIntervals.set(npc.id, interval);
  }

  private async freezeNPC(npc: INPC): Promise<void> {
    await NPC.updateOne({ _id: npc._id }, { isBehaviorEnabled: false });
    const npcCycle = NPC_CYCLES.get(npc.id);

    if (npcCycle) {
      await npcCycle.clear();
    }

    const battleCycle = NPC_BATTLE_CYCLES.get(npc.id);

    if (battleCycle) {
      await battleCycle.clear();
    }

    this.freezeCheckIntervals.delete(npc.id);
  }

  private async shouldFreezeNPC(npc: INPC): Promise<boolean> {
    const nearbyCharacters = await this.npcView.getCharactersInView(npc);

    return !nearbyCharacters.length;
  }
}
