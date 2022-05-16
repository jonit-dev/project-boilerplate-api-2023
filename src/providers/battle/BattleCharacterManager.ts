/* eslint-disable no-new */
import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { provide } from "inversify-binding-decorators";
import { BattleAttackTarget } from "./BattleAttackTarget";
import { BattleCycle } from "./BattleCycle";

@provide(BattleCharacterManager)
export class BattleCharacterManager {
  constructor(private battleAttackTarget: BattleAttackTarget, private movementHelper: MovementHelper) {}

  public onHandleCharacterBattleLoop(character: ICharacter, target: ICharacter | INPC): void {
    new BattleCycle(
      character.id,
      async () => {
        // get an updated version of the character and target.
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

        await this.attackTarget(updatedCharacter, updatedTarget);
      },
      character.attackIntervalSpeed
    );
  }

  public async attackTarget(character: ICharacter, target: ICharacter | INPC): Promise<void> {
    try {
      const canAttack = this.canAttack(character, target);

      if (!canAttack) {
        return;
      }

      if (!character) {
        throw new Error("Failed to find character");
      }

      await this.battleAttackTarget.checkRangeAndAttack(character, target);
    } catch (err) {
      console.error(err);
    }
  }

  private canAttack(attacker: ICharacter | INPC, target: ICharacter | INPC): boolean {
    if (!target.isAlive) {
      return false;
    }

    if (!attacker.isAlive) {
      return false;
    }

    return true;
  }
}
