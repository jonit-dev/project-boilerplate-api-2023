import { Character } from "@entities/ModuleCharacter/CharacterModel";

type SetInterval = ReturnType<typeof setInterval>;

export class NPCCycle {
  public static npcCycles: Map<string, NPCCycle> = new Map<string, NPCCycle>(); // create a map to store npc behavior intervals.

  public interval: SetInterval;
  public id: string;

  constructor(id: string, fn: Function, intervalSpeed: number) {
    this.id = id;
    this.interval = setInterval(() => {
      fn();
    }, intervalSpeed);

    if (NPCCycle.npcCycles.has(this.id)) {
      const npcCycle = NPCCycle.npcCycles.get(this.id);
      if (npcCycle) {
        npcCycle.clear();
      }
    } else {
      NPCCycle.npcCycles.set(this.id, this);
    }
  }

  public async clear(): Promise<void> {
    clearInterval(this.interval);
    NPCCycle.npcCycles.delete(this.id);

    await Character.updateOne({ _id: this.id }, { $unset: { target: 1 } });
  }
}
