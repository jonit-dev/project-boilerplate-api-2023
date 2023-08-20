/* eslint-disable require-await */
/* eslint-disable no-void */
/* eslint-disable no-new */
import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { CharacterValidation } from "@providers/character/CharacterValidation";
import { CharacterWeapon } from "@providers/character/CharacterWeapon";
import { CharacterClass, EntityAttackType } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { BattleAttackTarget } from "../BattleAttackTarget/BattleAttackTarget";
import { BattleCycle } from "../BattleCycle";
import { BattleTargeting } from "../BattleTargeting";
import { BattleNetworkStopTargeting } from "../network/BattleNetworkStopTargetting";
import { BattleCharacterAttackValidation } from "./BattleCharacterAttackValidation";
import { CharacterSkull } from "@providers/character/CharacterSkull";

@provide(BattleCharacterAttack)
export class BattleCharacterAttack {
  constructor(
    private battleAttackTarget: BattleAttackTarget,
    private battleCharacterAttackValidation: BattleCharacterAttackValidation,

    private battleTargeting: BattleTargeting,
    private battleNetworkStopTargeting: BattleNetworkStopTargeting,
    private characterValidation: CharacterValidation,
    private battleCycle: BattleCycle,
    private characterWeapon: CharacterWeapon,

    private characterSkull: CharacterSkull
  ) {}

  public async onHandleCharacterBattleLoop(character: ICharacter, target: ICharacter | INPC): Promise<void> {
    if (!character || !target) {
      return;
    }

    const attackType = await this.characterWeapon.getAttackType(character);

    let attackIntervalSpeed = character.attackIntervalSpeed;

    if (attackType === EntityAttackType.Ranged) {
      switch (character.class) {
        case CharacterClass.Hunter:
          attackIntervalSpeed = attackIntervalSpeed * 1.2;
          break;
        default:
          attackIntervalSpeed = attackIntervalSpeed * 1.35;
          break;
      }
    }

    await this.battleCycle.init(character, target._id, attackIntervalSpeed, async () => {
      await this.execCharacterBattleCycleLoop(character, target);
    });
  }

  @TrackNewRelicTransaction()
  private async execCharacterBattleCycleLoop(character: ICharacter, target: ICharacter | INPC): Promise<void> {
    const updatedCharacter = (await Character.findOne({ _id: character._id, scene: target.scene }).lean({
      virtuals: true,
      defaults: true,
    })) as ICharacter;

    if (!updatedCharacter) {
      this.battleCycle.stop(character._id);
      return;
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
      })) as ISkill;

    updatedCharacter.skills = characterSkills;

    let updatedTarget;

    if (target.type === "NPC") {
      updatedTarget = await NPC.findOne({ _id: target._id, scene: target.scene }).lean({
        virtuals: true,
        defaults: true,
      });

      const updatedNPCSkills = await Skill.findOne({ owner: target._id, ownerType: "NPC" })
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
      updatedTarget = await Character.findOne({ _id: target._id, scene: target.scene }).lean({
        virtuals: true,
        defaults: true,
      });

      const updatedCharacterSkills = await Skill.findOne({ owner: target._id, ownerType: "Character" }).cacheQuery({
        cacheKey: `${target._id}-skills`,
      });

      updatedTarget.skills = updatedCharacterSkills;
    }

    if (!updatedCharacter || !updatedTarget) {
      throw new Error("Failed to get updated required elements for attacking target.");
    }

    await this.attackTarget(updatedCharacter, updatedTarget);
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
        // check for skull
        if (
          target.type === "Character" &&
          this.characterSkull.checkForUnjustifiedAttack(character, target as ICharacter)
        ) {
          await this.characterSkull.updateWhiteSkull(character._id.toString(), target._id.toString());
        }
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
