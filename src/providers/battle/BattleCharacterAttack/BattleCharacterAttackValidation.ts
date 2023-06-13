import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Skill } from "@entities/ModuleCharacter/SkillsModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { NewRelic } from "@providers/analytics/NewRelic";
import { PVP_MIN_REQUIRED_LV } from "@providers/constants/PVPConstants";
import { SpecialEffect } from "@providers/entityEffects/SpecialEffect";
import { MapNonPVPZone } from "@providers/map/MapNonPVPZone";
import { NewRelicTransactionCategory } from "@providers/types/NewRelicTypes";
import { EntityType, ISkill } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { BattleTargeting } from "../BattleTargeting";

@provide(BattleCharacterAttackValidation)
export class BattleCharacterAttackValidation {
  constructor(
    private mapNonPVPZone: MapNonPVPZone,
    private battleTargeting: BattleTargeting,
    private specialEffect: SpecialEffect,
    private newRelic: NewRelic
  ) {}

  public async canAttack(attacker: ICharacter | INPC, target: ICharacter | INPC): Promise<boolean> {
    return await this.newRelic.trackTransaction(
      NewRelicTransactionCategory.Operation,
      "BattleCharacterAttackValidation.canAttack",
      async () => {
        if (!target.isAlive) {
          return false;
        }

        if (!attacker.isAlive) {
          return false;
        }

        if (target.id === attacker.id) {
          return false;
        }

        if (await this.specialEffect.isInvisible(target)) {
          return false;
        }

        if (target.type === "Character") {
          let attackerSkills = attacker?.skills as ISkill;
          let targetSkills = target?.skills as ISkill;

          if (!attackerSkills?.level) {
            attackerSkills = (await Skill.findById(attacker.skills)
              .lean()
              .cacheQuery({
                cacheKey: `${attacker?._id}-skills`,
              })) as unknown as ISkill;
          }

          if (!targetSkills?.level) {
            targetSkills = (await Skill.findById(target.skills)
              .lean()
              .cacheQuery({
                cacheKey: `${target?._id}-skills`,
              })) as unknown as ISkill;
          }

          const pvpLvRestrictedReason = this.isCharactersLevelRestrictedForPVP(attackerSkills, targetSkills);

          if (pvpLvRestrictedReason) {
            await this.battleTargeting.cancelTargeting(
              attacker as unknown as ICharacter,
              pvpLvRestrictedReason as string,
              target.id,
              target.type as EntityType
            );
            return false;
          }

          const isAttackerAtNonPVPZone = this.mapNonPVPZone.isNonPVPZoneAtXY(attacker.scene, attacker.x, attacker.y);

          if (isAttackerAtNonPVPZone) {
            await this.battleTargeting.cancelTargeting(
              attacker as unknown as ICharacter,
              "Sorry, you can't attack a target while inside a non-PVP zone.",
              target.id,
              target.type as EntityType
            );
            return false;
          }

          const isTargetAtNonPVPZone = this.mapNonPVPZone.isNonPVPZoneAtXY(target.scene, target.x, target.y);
          if (isTargetAtNonPVPZone) {
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
    );
  }

  private isCharactersLevelRestrictedForPVP(attackerSkills: ISkill, defenderSkills: ISkill): boolean | string {
    if (attackerSkills?.level < PVP_MIN_REQUIRED_LV) {
      return `PVP is restricted to level ${PVP_MIN_REQUIRED_LV} and above.`;
    }

    if (defenderSkills?.level < PVP_MIN_REQUIRED_LV) {
      return `You can't attack a target that's below level ${PVP_MIN_REQUIRED_LV}.`;
    }

    return false;
  }
}
