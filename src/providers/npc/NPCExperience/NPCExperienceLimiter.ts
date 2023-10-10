import { INPC } from "@entities/ModuleNPC/NPCModel";
import { provide } from "inversify-binding-decorators";

@provide(NPCExperienceLimiter)
export class NPCExperienceLimiter {
  public isXpInRange(target: INPC): boolean {
    if (!target.experience || !target.xpToRelease) return false;

    const totalXpRequired = target.xpToRelease.reduce((acc, curr) => acc + curr.xp, 0);

    return totalXpRequired <= target.experience;
  }
}
