import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { SkillCalculator } from "@providers/skill/SkillCalculator";
import { BasicAttribute, CombatSkill, IAppliedBuffsEffect, ISkillDetails, SkillType } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { Types } from "mongoose";

@provide(BuffSkillFunctions)
export class BuffSkillFunctions {
  constructor(private skillCalculator: SkillCalculator) {}

  /**
   * Positive buff will add level, negative buff will remove level
   * @param skills Skills
   * @param skillType Type of skill, BasicAttribute, CombatSkill, etc.
   * @param buffedLvl number of buffed lvl
   * @param isAdding adding or removing buff
   * @returns true if success
   */
  public async updateBuffSkillLevel(
    skills: ISkill,
    skillType: string,
    buffedLvl: number,
    isAdding: boolean
  ): Promise<boolean> {
    if (buffedLvl === 0) {
      return false;
    }

    const skill = skills[skillType] as ISkillDetails;
    if (isAdding) {
      skill.level += buffedLvl;
    } else {
      skill.level = Math.max(Math.round(skill.level - buffedLvl), 1);
    }
    skill.skillPointsToNextLevel = this.skillCalculator.calculateSPToNextLevel(skill.skillPoints, skill.level + 1);

    const save = await skills.save();
    if (save) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * This add or remove buff on character and return a object of type appliedBuffsEffect
   * if is adding, we dont need the _id param, but if is removing, we need the _id param
   * to search on array character.appliedBuffEffect
   * @param character character to update
   * @param skillType skyllType BasicAttributes,CombatSkill, etc.
   * @param diffLvl differencer of lvl
   * @param isAdding adding or removing
   * @param _id id of buff on array character.appliedBuffEffect
   * @returns an object of type appliedBuffsEffect
   */
  public async updateBuffEffectOnCharacter(
    character: ICharacter,
    skillType: string,
    diffLvl: number,
    isAdding: boolean,
    _id?: Types.ObjectId
  ): Promise<IAppliedBuffsEffect> {
    const appliedBuffsEffect: {
      _id: Types.ObjectId;
      key: string;
      value: number;
    } = {
      // eslint-disable-next-line no-unneeded-ternary
      _id: _id ? _id : new Types.ObjectId(),
      key: skillType,
      value: diffLvl,
    };

    if (isAdding) {
      await Character.updateOne(
        {
          _id: character._id,
        },
        {
          $push: {
            appliedBuffsEffects: appliedBuffsEffect,
          },
        }
      );
    } else {
      await Character.updateOne(
        {
          _id: character._id,
        },
        {
          $pull: {
            appliedBuffsEffects: {
              _id: appliedBuffsEffect._id,
            },
          },
        }
      );
    }

    return appliedBuffsEffect;
  }

  public async updateBuffXpOnCharacter(characterId: Types.ObjectId, key: string, buff: number): Promise<void> {
    const character = (await Character.findById(characterId)) as ICharacter;
    if (!character.appliedBuffsEffects) {
      return;
    }

    const existingEffect = character.appliedBuffsEffects.find((effect) => effect.key === key);

    if (existingEffect) {
      if (existingEffect.value >= 100) {
        return;
      }
      if (buff > 0 && existingEffect.value <= 100) {
        existingEffect.value += buff;
      } else if (buff < 0 && existingEffect.value > 0) {
        existingEffect.value -= buff * -1;
      }
    } else {
      const appliedBuffsEffect: IAppliedBuffsEffect = {
        _id: new Types.ObjectId(),
        key,
        value: buff,
      };
      character.appliedBuffsEffects.push(appliedBuffsEffect);
    }

    character.appliedBuffsEffects.forEach((xpBuff) => {
      xpBuff.value = Math.min(Math.max(xpBuff.value, 0), 100);
    });

    await Character.updateOne(
      {
        _id: character._id,
      },
      {
        $set: {
          appliedBuffsEffects: character.appliedBuffsEffects,
        },
      }
    );
  }

  /**
   * This functions remove all the buffs effects from a character.
   * @param character Character to remove all buffs.
   */
  public async removeAllBuffEffectOnCharacter(character: ICharacter): Promise<void> {
    if (!character) {
      throw new Error("Character not found");
    }

    const skills = (await Skill.findById(character.skills)) as ISkill;
    const appliedBuffsEffects = character.appliedBuffsEffects;

    if (appliedBuffsEffects) {
      const isAdding = false;
      const totalValues = this.sumBuffEffects(appliedBuffsEffects);

      for (let i = 0; i < totalValues.length; i++) {
        if (totalValues[i].key !== "experience") {
          await this.updateBuffSkillLevel(skills, totalValues[i].key, totalValues[i].value, isAdding);
        }
      }
    }

    await Character.updateOne({ _id: character._id }, { $set: { appliedBuffsEffects: [] } });
  }

  /**
   * Return the type of skill.Example: BasicAttributes, CombatSkills, etc.
   * @param skillType Skill type to get the definition.
   * @returns a string with the skill type definition.
   */
  public getSkillTypeDefinition(skillType: string): string {
    let skillTypeDefinition = "";

    const basicAttributes: BasicAttribute[] = [
      BasicAttribute.Strength,
      BasicAttribute.Resistance,
      BasicAttribute.Dexterity,
      BasicAttribute.Magic,
      BasicAttribute.MagicResistance,
    ];

    const combatSkills: CombatSkill[] = [
      CombatSkill.First,
      CombatSkill.Sword,
      CombatSkill.Dagger,
      CombatSkill.Axe,
      CombatSkill.Distance,
      CombatSkill.Shielding,
      CombatSkill.Club,
    ];

    if (
      basicAttributes.includes(skillType as BasicAttribute) ||
      basicAttributes.indexOf(skillType as BasicAttribute) !== -1
    ) {
      return (skillTypeDefinition = SkillType.BasicAttributes);
    }

    if (combatSkills.includes(skillType as CombatSkill) || combatSkills.indexOf(skillType as CombatSkill) !== -1) {
      return (skillTypeDefinition = SkillType.Combat);
    }

    return skillTypeDefinition;
  }

  public calculateIncreaseLvl(currentLvl: number, percentage: number): number {
    if (percentage < 0) {
      return 0;
    } else {
      return Math.max(Math.ceil((currentLvl * percentage) / 100), 1);
    }
  }

  /**
   *
   * @param array array from character.appliedBuffsEffects
   * @param buffId _id of buff to get value
   * @returns return the value of buff on skill
   */
  public getValueByBuffId(
    array: { _id: Types.ObjectId; key: string; value: number }[],
    buffId: Types.ObjectId
  ): number {
    // @ts-ignore
    const result = array.filter((element) => element._id.equals(buffId));
    return result.length > 0 ? result[0].value : 0;
  }

  /**
   *
   * @param array array from character.appliedBuffsEffects
   * @param key the name of skill, strengh, magic, distance, etc.
   * @returns return the total of all values of buff on skill
   */
  public getTotalValueByKey(array: { key: string; value: number }[], key: string): number {
    const filteredArray = array.filter((element) => element.key === key);
    return filteredArray.length > 0 ? filteredArray.reduce((sum, current) => sum + current.value, 0) : 0;
  }

  public sumBuffEffects(buffs: IAppliedBuffsEffect[]): { key: string; value: number }[] {
    const keys = Array.from(new Set(buffs.map((buff) => buff.key)));
    const result = keys.map((key) => {
      const value = buffs.filter((buff) => buff.key === key).reduce((sum, buff) => sum + buff.value, 0);
      return { key, value };
    });
    return result;
  }
}
