import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { SkillFunctions } from "@providers/skill/SkillFunctions";
import { BasicAttribute, IAppliedBuffsEffect, IIncreaseSPResult } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { Types } from "mongoose";
import { BuffSkillFunctions } from "./BuffSkillFunctions";

@provide(CharacterBasicAttributesBuff)
export class CharacterBasicAttributesBuff {
  constructor(
    private skillFunctions: SkillFunctions,
    private buffSkillFunctions: BuffSkillFunctions,
    private inMemoryHashTable: InMemoryHashTable
  ) {}

  public async updateBasicAttribute(
    character: ICharacter,
    basicAttribute: BasicAttribute,
    percentageOfBuff: number,
    buffId?: Types.ObjectId
  ): Promise<IAppliedBuffsEffect> {
    const isAdding = percentageOfBuff > 0;

    const appliedBuffEffect: IAppliedBuffsEffect = await this.basicAttributeHandler(
      character,
      basicAttribute,
      isAdding,
      percentageOfBuff,
      buffId
    );
    return appliedBuffEffect;
  }

  private async basicAttributeHandler(
    character: ICharacter,
    basicAttribute: BasicAttribute,
    isAdding: boolean,
    percentageOfBuff: number,
    buffId?: Types.ObjectId
  ): Promise<IAppliedBuffsEffect> {
    let skillLevelAfter = 0;
    let diffLvl = 0;
    let appliedBuffsEffect: { _id: Types.ObjectId; key: string; value: number } = {
      _id: new Types.ObjectId(),
      key: "",
      value: 0,
    };

    const skills = (await Skill.findById(character.skills)) as ISkill;
    const skillLvl = skills[basicAttribute].level;

    if (isAdding) {
      diffLvl = this.buffSkillFunctions.calculateIncreaseLvl(skillLvl, percentageOfBuff);
      skillLevelAfter = skillLvl + diffLvl;
    } else {
      if (character.appliedBuffsEffects?.length === 0) {
        return appliedBuffsEffect;
      }
      if (character && character.appliedBuffsEffects && buffId) {
        diffLvl = this.buffSkillFunctions.getValueByBuffId(character.appliedBuffsEffects, buffId);
        skillLevelAfter = skillLvl - diffLvl;
      }
    }

    const updateSuccess = await this.buffSkillFunctions.updateBuffSkillLevel(skills, basicAttribute, diffLvl, isAdding);

    if (updateSuccess) {
      const skillLevelUpEvents: IIncreaseSPResult = {
        skillLevelUp: true,
        skillLevelBefore: skillLvl,
        skillLevelAfter,
        skillName: basicAttribute,
      };

      appliedBuffsEffect = await this.buffSkillFunctions.updateBuffEffectOnCharacter(
        character._id,
        basicAttribute,
        diffLvl,
        isAdding,
        buffId
      );

      await this.skillFunctions.sendSkillLevelUpEvents(skillLevelUpEvents, character);
    }

    // If we have a change in Basic Attributes(except dexterity), we clean the records in redis,
    // because Basic Attributes influence on totalAttack or totalDefense

    if (skills.owner && appliedBuffsEffect.key !== BasicAttribute.Dexterity) {
      await this.inMemoryHashTable.delete(skills.owner.toString(), "totalAttack");
      await this.inMemoryHashTable.delete(skills.owner.toString(), "totalDefense");
    }

    await this.skillFunctions.updateSkills(skills, character);

    return appliedBuffsEffect;
  }
}
