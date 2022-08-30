import { Character } from "@entities/ModuleCharacter/CharacterModel";

type SetInterval = ReturnType<typeof setInterval>;

export class NPCBattleCycle {
  public static npcBattleCycles: Map<string, NPCBattleCycle> = new Map<string, NPCBattleCycle>(); // create a map to store npc behavior intervals.

  public interval: SetInterval;
  public id: string;

  constructor(id: string, fn: Function, intervalSpeed: number) {
    this.id = id;
    this.interval = setInterval(() => {
      fn();
    }, intervalSpeed);

    if (NPCBattleCycle.npcBattleCycles.has(this.id)) {
      const npcCycle = NPCBattleCycle.npcBattleCycles.get(this.id);
      if (npcCycle) {
        npcCycle.clear();
      }
    } else {
      NPCBattleCycle.npcBattleCycles.set(this.id, this);
    }
  }

  public async clear(): Promise<void> {
    clearInterval(this.interval);
    NPCBattleCycle.npcBattleCycles.delete(this.id);

    await Character.updateOne({ _id: this.id }, { $unset: { target: 1 } });
  }
}
