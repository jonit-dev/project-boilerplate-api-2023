import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { provide } from "inversify-binding-decorators";
import { CharacterBattleCycle } from "./BattleCycle";

@provide(BattleCharacterManager)
export class BattleCharacterManager {
  public static battleCycles: Map<string, CharacterBattleCycle> = new Map<string, CharacterBattleCycle>(); // create a map to store character intervals.

  public onHandleCharacterBattleLoop(character: ICharacter, target: ICharacter | INPC): void {
    // make sure we always have only one battle cycle per character.
    if (BattleCharacterManager.battleCycles.has(character._id)) {
      const battleCycle = BattleCharacterManager.battleCycles.get(character.id);
      if (battleCycle) {
        battleCycle.clear();
        BattleCharacterManager.battleCycles.delete(character.id);
      }
    } else {
      const charBattleCycle = new CharacterBattleCycle(() => {
        console.log("attacking target");
      }, character.attackIntervalSpeed);

      BattleCharacterManager.battleCycles.set(character.id, charBattleCycle);
    }
  }
}
