/* eslint-disable no-new */
import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { provide } from "inversify-binding-decorators";
import { BattleAttackTarget } from "../BattleAttackTarget/BattleAttackTarget";
import { BattleCycle } from "../BattleCycle";
import { BattleCharacterAttackValidation } from "./BattleCharacterAttackValidation";

@provide(BattleCharacterAttack)
export class BattleCharacterAttack {
  constructor(
    private battleAttackTarget: BattleAttackTarget,
    private battleCharacterAttackValidation: BattleCharacterAttackValidation,
    private socketMessaging: SocketMessaging
  ) {}

  public async onHandleCharacterBattleLoop(character: ICharacter, target: ICharacter | INPC): Promise<void> {
    if (!character.isBattleActive) {
      character.isBattleActive = true;
      await character.save();
    } else {
      this.socketMessaging.sendErrorMessageToCharacter(character);
      return;
    }

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

  public async attackTarget(character: ICharacter, target: ICharacter | INPC): Promise<boolean> {
    try {
      const canAttack = await this.battleCharacterAttackValidation.canAttack(character, target);

      if (!canAttack) {
        return false;
      }

      if (!character) {
        throw new Error("Failed to find character");
      }

      const checkRangeAndAttack = await this.battleAttackTarget.checkRangeAndAttack(character, target);

      if (checkRangeAndAttack) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}
