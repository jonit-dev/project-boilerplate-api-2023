import { Character } from "@entities/ModuleCharacter/CharacterModel";
import { locker } from "@providers/inversify/container";

type SetInterval = ReturnType<typeof setInterval>;

export const NPC_BATTLE_CYCLES: Map<string, NPCBattleCycle> = new Map<string, NPCBattleCycle>();

export class NPCBattleCycle {
  public interval: SetInterval;
  public id: string;

  constructor(id: string, fn: Function, intervalSpeed: number) {
    this.id = id;
    this.interval = setInterval(() => {
      fn();
    }, intervalSpeed);

    if (NPC_BATTLE_CYCLES.has(this.id)) {
      const npcCycle = NPC_BATTLE_CYCLES.get(this.id);
      if (npcCycle) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        npcCycle.clear();
      }
    } else {
      NPC_BATTLE_CYCLES.set(this.id, this);
    }
  }

  public async clear(): Promise<void> {
    clearInterval(this.interval);
    NPC_BATTLE_CYCLES.delete(this.id);
    await locker.unlock(`npc-${this.id}-npc-battle-cycle`);
    await locker.unlock(`npc-${this.id}-npc-cycle`);
    await Character.updateOne({ _id: this.id }, { $unset: { target: 1 } });
  }

  public clearIntervalOnly(): void {
    clearInterval(this.interval);
    NPC_BATTLE_CYCLES.delete(this.id);
  }
}
