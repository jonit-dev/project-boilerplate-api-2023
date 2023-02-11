/* eslint-disable no-new */
import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill } from "@entities/ModuleCharacter/SkillsModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { BattleNetworkStopTargeting } from "@providers/battle/network/BattleNetworkStopTargetting";
import { PVP_MIN_REQUIRED_LV } from "@providers/constants/PVPConstants";
import { MapNonPVPZone } from "@providers/map/MapNonPVPZone";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { BattleSocketEvents, EntityType, IBattleCancelTargeting } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { BattleAttackTarget } from "./BattleAttackTarget/BattleAttackTarget";
import { BattleCycle } from "./BattleCycle";

@provide(BattleCharacterManager)
export class BattleCharacterManager {
  constructor(
    private battleAttackTarget: BattleAttackTarget,
    private mapNonPVPZone: MapNonPVPZone,
    private battleNetworkStopTargeting: BattleNetworkStopTargeting,
    private socketMessaging: SocketMessaging
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

  public async cancelTargeting(
    attacker: ICharacter,
    reason: string,
    targetId: string,
    targetType: EntityType
  ): Promise<void> {
    await this.battleNetworkStopTargeting.stopTargeting(attacker as unknown as ICharacter);

    this.socketMessaging.sendEventToUser<IBattleCancelTargeting>(
      attacker.channelId!,
      BattleSocketEvents.CancelTargeting,
      {
        targetId,
        type: targetType,
        reason,
      }
    );
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
      const pvpLvRestrictedReason = this.isCharactersLevelRestrictedForPVP(attacker, target);

      if (pvpLvRestrictedReason) {
        await this.cancelTargeting(
          attacker as unknown as ICharacter,
          pvpLvRestrictedReason as string,
          target.id,
          target.type as EntityType
        );
        return false;
      }

      const isNonPVPZone = this.mapNonPVPZone.isNonPVPZoneAtXY(target.scene, target.x, target.y);
      if (isNonPVPZone) {
        await this.cancelTargeting(
          attacker as unknown as ICharacter,
          "Sorry, you can't attack a target in a non-PVP zone.",
          target.id,
          target.type as EntityType
        );

        return false;
      }
    }

    return true;
  }

  private isCharactersLevelRestrictedForPVP(attacker: ICharacter | INPC, target: ICharacter | INPC): boolean | string {
    const attackerSkills = attacker?.skills as ISkill;
    const defenderSkills = target?.skills as ISkill;

    if (attackerSkills.level < PVP_MIN_REQUIRED_LV) {
      return `PVP is restricted to level ${PVP_MIN_REQUIRED_LV} and above.`;
    }

    if (defenderSkills.level < PVP_MIN_REQUIRED_LV) {
      return `You can't attack a target that's below level ${PVP_MIN_REQUIRED_LV}.`;
    }

    return false;
  }
}
