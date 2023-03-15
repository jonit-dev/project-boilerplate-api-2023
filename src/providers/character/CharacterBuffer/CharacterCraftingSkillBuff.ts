import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { SkillFunctions } from "@providers/skill/SkillFunctions";
import { CraftingSkill, IAppliedBuffsEffect, IIncreaseSPResult } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { Types } from "mongoose";
import { BuffSkillFunctions } from "./BuffSkillFunctions";

@provide(CharacterCraftingSkillBuff)
export class CharacterCraftingSkillBuff {
  constructor(private skillFunctions: SkillFunctions, private buffSkillFunctions: BuffSkillFunctions) {}

  public async updateCraftingSkill(
    character: ICharacter,
    craftingSkill: CraftingSkill,
    percentageOfBuff: number,
    buffId?: Types.ObjectId
  ): Promise<IAppliedBuffsEffect> {
    const isAdding = percentageOfBuff > 0;

    const appliedBuffsEffect = await this.craftingSkillHandler(
      character,
      craftingSkill,
      isAdding,
      percentageOfBuff,
      buffId
    );

    return appliedBuffsEffect;
  }

  private async craftingSkillHandler(
    character: ICharacter,
    craftingSkill: CraftingSkill,
    isAdding: boolean,
    buff: number,
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
    const skillLvl = skills[craftingSkill].level;

    if (isAdding) {
      diffLvl = this.buffSkillFunctions.calculateIncreaseLvl(skillLvl, buff);
      skillLevelAfter = skillLvl + diffLvl;
    } else {
      if (character && character.appliedBuffsEffects && buffId) {
        diffLvl = this.buffSkillFunctions.getValueByBuffId(character.appliedBuffsEffects, buffId);
        skillLevelAfter = skillLvl - diffLvl;
      }
    }

    const updateSuccess = await this.buffSkillFunctions.updateBuffSkillLevel(skills, craftingSkill, diffLvl, isAdding);

    if (updateSuccess) {
      const skillLevelUpEvents: IIncreaseSPResult = {
        skillLevelUp: true,
        skillLevelBefore: skillLvl,
        skillLevelAfter,
        skillName: craftingSkill,
      };

      appliedBuffsEffect = await this.buffSkillFunctions.updateBuffEffectOnCharacter(
        character,
        craftingSkill,
        diffLvl,
        isAdding,
        buffId
      );

      await this.skillFunctions.sendSkillLevelUpEvents(skillLevelUpEvents, character);
    }

    await this.skillFunctions.updateSkills(skills, character);

    return appliedBuffsEffect;
  }
}
