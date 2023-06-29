/* eslint-disable require-await */
/* eslint-disable no-void */
/* eslint-disable no-new */
import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { NewRelic } from "@providers/analytics/NewRelic";
import { CharacterValidation } from "@providers/character/CharacterValidation";
import { NewRelicTransactionCategory } from "@providers/types/NewRelicTypes";
import { provide } from "inversify-binding-decorators";
import { BattleAttackTarget } from "../BattleAttackTarget/BattleAttackTarget";
import { BattleCycle } from "../BattleCycle";
import { BattleTargeting } from "../BattleTargeting";
import { BattleNetworkStopTargeting } from "../network/BattleNetworkStopTargetting";
import { BattleCharacterAttackValidation } from "./BattleCharacterAttackValidation";

@provide(BattleCharacterAttack)
export class BattleCharacterAttack {
  constructor(
    private battleAttackTarget: BattleAttackTarget,
    private battleCharacterAttackValidation: BattleCharacterAttackValidation,
    private newRelic: NewRelic,
    private battleTargeting: BattleTargeting,
    private battleNetworkStopTargeting: BattleNetworkStopTargeting,
    private characterValidation: CharacterValidation,
    private battleCycle: BattleCycle
  ) {}

  public async onHandleCharacterBattleLoop(character: ICharacter, target: ICharacter | INPC): Promise<void> {
    if (!character || !target) {
      return;
    }

    await this.battleCycle.init(character._id, character.attackIntervalSpeed, async () => {
      await this.execAttackLoop(character, target);
    });
  }

  private async execAttackLoop(character: ICharacter, target: ICharacter | INPC): Promise<void> {
    await this.newRelic.trackTransaction(NewRelicTransactionCategory.Operation, "CharacterBattleCycle", async () => {
      const updatedCharacter = (await Character.findOne({ _id: character._id }).lean({
        virtuals: true,
        defaults: true,
      })) as ICharacter;

      if (!updatedCharacter) {
        throw new Error("Failed to get updated character for attacking target.");
      }

      const hasBasicValidation = this.characterValidation.hasBasicValidation(updatedCharacter);

      if (!hasBasicValidation) {
        await this.battleTargeting.cancelTargeting(updatedCharacter);
        await this.battleNetworkStopTargeting.stopTargeting(updatedCharacter);
        return;
      }

      const characterSkills = (await Skill.findOne({ owner: character._id })
        .lean({
          virtuals: true,
          defaults: true,
        })
        .cacheQuery({
          cacheKey: `${character._id}-skills`,
          ttl: 86400,
        })) as ISkill;

      updatedCharacter.skills = characterSkills;

      let updatedTarget;

      if (target.type === "NPC") {
        updatedTarget = await NPC.findOne({ _id: target._id }).lean({
          virtuals: true,
          defaults: true,
        });

        const updatedNPCSkills = await Skill.findOne({ owner: target._id })
          .lean({
            virtuals: true,
            defaults: true,
          })
          .cacheQuery({
            cacheKey: `${target._id}-skills`,
          });

        updatedTarget.skills = updatedNPCSkills;
      }
      if (target.type === "Character") {
        updatedTarget = await Character.findOne({ _id: target._id }).lean({
          virtuals: true,
          defaults: true,
        });

        const updatedCharacterSkills = await Skill.findOne({ owner: target._id }).cacheQuery({
          cacheKey: `${target._id}-skills`,
        });

        updatedTarget.skills = updatedCharacterSkills;
      }

      if (!updatedCharacter || !updatedTarget) {
        throw new Error("Failed to get updated required elements for attacking target.");
      }

      await this.attackTarget(updatedCharacter, updatedTarget);
    });
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
