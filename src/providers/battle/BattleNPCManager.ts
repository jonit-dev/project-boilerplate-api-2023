import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { provide } from "inversify-binding-decorators";
import { BattleAttackTarget } from "./BattleAttackTarget";

@provide(BattleNPCManager)
export class BattleNPCManager {
  constructor(private battleAttackTarget: BattleAttackTarget) {}

  public async attackCharacter(npc: INPC, target: ICharacter): Promise<void> {
    await this.battleAttackTarget.checkRangeAndAttack(npc, target);
  }
}
