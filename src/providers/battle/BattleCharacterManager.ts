import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { provide } from "inversify-binding-decorators";
import { EntityBehavioralLoop } from "../entities/EntityBehavioralLoop";
import { BattleCharacterAttackTarget } from "./BattleCharacterAttackTarget";

@provide(BattleCharacterManager)
export class BattleCharacterManager {
  public static battleCycles: Map<string, EntityBehavioralLoop> = new Map<string, EntityBehavioralLoop>(); // create a map to store character intervals.

  constructor(private battleCharacterAttackTarget: BattleCharacterAttackTarget) {}

  public onHandleCharacterBattleLoop(character: ICharacter, target: ICharacter | INPC): void {
    // make sure we always have only one battle cycle per character.
    if (BattleCharacterManager.battleCycles.has(character._id)) {
      const battleCycle = BattleCharacterManager.battleCycles.get(character.id);
      if (battleCycle) {
        battleCycle.clear();
        BattleCharacterManager.battleCycles.delete(character.id);
      }
    } else {
      const charBattleCycle = new EntityBehavioralLoop(async () => {
        // get an updated version of the character
        const updatedCharacter = await Character.findOne({ _id: character._id }).populate("skills");
        let updatedTarget;

        if (target.type === "NPC") {
          updatedTarget = await NPC.findOne({ _id: target._id }).populate("skills");
        }
        if (target.type === "Character") {
          updatedTarget = await Character.findOne({ _id: target._id }).populate("skills");
        }

        if (!updatedCharacter || !updatedTarget) {
          throw new Error("Failed to get updated required elements for attacking target.");
        }

        this.battleCharacterAttackTarget.attackTarget(updatedCharacter, updatedTarget);
      }, character.attackIntervalSpeed);

      BattleCharacterManager.battleCycles.set(character.id, charBattleCycle);
    }
  }
}
