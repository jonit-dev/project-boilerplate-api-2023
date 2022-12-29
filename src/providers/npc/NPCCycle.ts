/* eslint-disable no-void */
import { Character } from "@entities/ModuleCharacter/CharacterModel";
import { NPC } from "@entities/ModuleNPC/NPCModel";
import { NPC_BATTLE_CYCLES } from "./NPCBattleCycle";

type SetInterval = ReturnType<typeof setInterval>;

export const NPC_CYCLES: Map<string, NPCCycle> = new Map<string, NPCCycle>();
export class NPCCycle {
  public interval: SetInterval;
  public id: string;

  constructor(id: string, fn: Function, intervalSpeed: number) {
    this.id = id;
    this.interval = setInterval(() => {
      fn();
    }, intervalSpeed);

    this.clearIfAlreadyExists();

    NPC_CYCLES.set(this.id, this);
  }

  public async clear(): Promise<void> {
    clearInterval(this.interval);
    NPC_CYCLES.delete(this.id);

    const battleCycle = NPC_BATTLE_CYCLES.get(this.id);

    if (battleCycle) {
      await battleCycle.clear();
    }

    await Character.updateOne({ _id: this.id }, { $unset: { target: 1 } });
    await NPC.updateOne({ _id: this.id }, { $set: { isBehaviorEnabled: false } });
  }

  private clearIfAlreadyExists(): void {
    if (NPC_CYCLES.has(this.id)) {
      const npcCycle = NPC_CYCLES.get(this.id);
      if (npcCycle) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        npcCycle.clear();
      }
    }
  }
}
