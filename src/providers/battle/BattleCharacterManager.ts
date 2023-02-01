/* eslint-disable no-new */
import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { BattleNetworkStopTargeting } from "@providers/battle/network/BattleNetworkStopTargetting";
import { MapNonPVPZone } from "@providers/map/MapNonPVPZone";
import { provide } from "inversify-binding-decorators";
import { BattleAttackTarget } from "./BattleAttackTarget";
import { BattleCycle } from "./BattleCycle";

@provide(BattleCharacterManager)
export class BattleCharacterManager {
  constructor(
    private battleAttackTarget: BattleAttackTarget,
    private mapNonPVPZone: MapNonPVPZone,
    private battleNetworkStopTargeting: BattleNetworkStopTargeting
  ) {}

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

  public async attackTarget(character: ICharacter, target: ICharacter | INPC): Promise<boolean> {
    try {
      const canAttack = await this.canAttack(character, target);

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

  private async canAttack(attacker: ICharacter | INPC, target: ICharacter | INPC): Promise<boolean> {
    if (!target.isAlive) {
      return false;
    }

    if (!attacker.isAlive) {
      return false;
    }

    if (target.id === attacker.id) {
      return false;
    }

    if (target.type === "Character") {
      const isNonPVPZone = this.mapNonPVPZone.isNonPVPZoneAtXY(target.scene, target.x, target.y);
      if (isNonPVPZone) {
        // clear battle cycle when target enter in a pvp zone.
        await this.battleNetworkStopTargeting.stopTargeting(attacker as unknown as ICharacter);
        // and send a event to Client revert targeting
        this.mapNonPVPZone.stopCharacterAttack(attacker as unknown as ICharacter);

        return false;
      }
    }

    return true;
  }
}
