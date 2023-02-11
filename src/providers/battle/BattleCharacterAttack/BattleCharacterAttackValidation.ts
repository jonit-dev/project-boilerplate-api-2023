import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { PVP_MIN_REQUIRED_LV } from "@providers/constants/PVPConstants";
import { MapNonPVPZone } from "@providers/map/MapNonPVPZone";
import { EntityType, ISkill } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { BattleTargeting } from "../BattleTargeting";

@provide(BattleCharacterAttackValidation)
export class BattleCharacterAttackValidation {
  constructor(private mapNonPVPZone: MapNonPVPZone, private battleTargeting: BattleTargeting) {}

  public async canAttack(attacker: ICharacter | INPC, target: ICharacter | INPC): Promise<boolean> {
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
        await this.battleTargeting.cancelTargeting(
          attacker as unknown as ICharacter,
          pvpLvRestrictedReason as string,
          target.id,
          target.type as EntityType
        );
        return false;
      }

      const isNonPVPZone = this.mapNonPVPZone.isNonPVPZoneAtXY(target.scene, target.x, target.y);
      if (isNonPVPZone) {
        await this.battleTargeting.cancelTargeting(
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
