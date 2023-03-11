import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { BasicAttribute, CharacterEntities, CombatSkill, IAppliedBuffsEffect, SkillType } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { Types } from "mongoose";
import { BuffSkillFunctions } from "./BuffSkillFunctions";
import { CharacterBasicAttributesBuff } from "./CharacterBasicAttributesBuff";
import { CharacterCombatSkillBuff } from "./CharacterCombatSkillBuff";
import { CharacterEntitiesBuff } from "./CharacterEntitiesBuff";

@provide(CharacterSkillBuff)
export class CharacterSkillBuff {
  constructor(
    private characterBasicAttributesBuff: CharacterBasicAttributesBuff,
    private characterCombatSkillBuff: CharacterCombatSkillBuff,
    private characterEntitiesBuff: CharacterEntitiesBuff,
    private buffSkillFunctions: BuffSkillFunctions
  ) {}

  /**
   * Add a permanent buff on his skill level to a character.
   * @param character Character to enable the permanent buff.
   * @param skillType Type of Skill. Ex: BasicAttributes, Combat, CraftingGatheringSkill
   * @param buff Positive number % to increase the level of skill 20 === 20%
   * @returns boolean
   */
  public async enablePermanentBuff(
    character: ICharacter,
    skillType: string,
    buff: number
  ): Promise<IAppliedBuffsEffect> {
    const skillTypeDefinition = this.buffSkillFunctions.getSkillTypeDefinition(skillType);
    let appliedBuffsEffect: { _id: Types.ObjectId; key: string; value: number } = {
      _id: new Types.ObjectId(),
      key: "",
      value: 0,
    };

    // The value of buff cannot be a negative number
    if (buff < 0) {
      return appliedBuffsEffect;
    }

    switch (skillTypeDefinition) {
      case SkillType.BasicAttributes: {
        appliedBuffsEffect = await this.characterBasicAttributesBuff.updateBasicAttribute(
          character,
          skillType as BasicAttribute,
          buff
        );
        break;
      }

      case SkillType.Combat: {
        appliedBuffsEffect = await this.characterCombatSkillBuff.updateCombatSkill(
          character,
          skillType as CombatSkill,
          buff
        );
        break;
      }

      case SkillType.Gathering: {
        // update the character gathering skill
        break;
      }

      default: {
        break;
      }
    }

    return appliedBuffsEffect;
  }

  /**
   * Disable the permanent buff of a character.
   * @param character Character to disable the permanent buff
   * @param skillType Type of Skill. Ex: BasicAttributes, Combat, CraftingGatheringSkill
   * @param debuff Negative number % to decrease the buff -20 = -20%
   * @returns boolean
   */
  public async disablePermanentBuff(
    character: ICharacter,
    skillType: string,
    debuff: number,
    buffId: Types.ObjectId
  ): Promise<void> {
    const skillTypeDefinition = this.buffSkillFunctions.getSkillTypeDefinition(skillType);

    // The value of debuff cannot be a positve number
    if (debuff > 0) {
      return;
    }

    switch (skillTypeDefinition) {
      case SkillType.BasicAttributes: {
        await this.characterBasicAttributesBuff.updateBasicAttribute(
          character,
          skillType as BasicAttribute,
          debuff,
          buffId
        );

        break;
      }

      case SkillType.Combat: {
        await this.characterCombatSkillBuff.updateCombatSkill(character, skillType as CombatSkill, debuff, buffId);

        break;
      }

      case SkillType.Gathering: {
        // update the character crafting gathering skill
        break;
      }

      default: {
        break;
      }
    }
  }

  /**
   * Active the temporary buff of a character.
   * @param character Character to disable the permanent buff
   * @param skillType Type of Skill. Ex: BasicAttributes, Combat, CraftingGatheringSkill
   * @param buff Positive number % to decrease the buff 20 = 20%
   * @param timeOutInSecs Time in seconds to disable the buff
   * @returns void
   */
  public async enableTemporaryBuff(
    character: ICharacter,
    skillType: string,
    buff: number,
    timeOutInSecs: number
  ): Promise<void> {
    const skillTypeDefinition = this.buffSkillFunctions.getSkillTypeDefinition(skillType);

    switch (skillTypeDefinition) {
      case SkillType.BasicAttributes: {
        const buffSkill = await this.characterBasicAttributesBuff.updateBasicAttribute(
          character,
          skillType as BasicAttribute,
          buff
        );

        setTimeout(async () => {
          const updatedCharacter = (await Character.findById(character._id).lean()) as ICharacter;
          if (updatedCharacter && updatedCharacter.appliedBuffsEffects) {
            const appliedBuffsEffect = this.buffSkillFunctions.getValueByBuffId(
              updatedCharacter?.appliedBuffsEffects,
              buffSkill._id
            );

            if (appliedBuffsEffect) {
              await this.characterBasicAttributesBuff.updateBasicAttribute(
                updatedCharacter,
                skillType as BasicAttribute,
                buff * -1,
                buffSkill._id
              );
            }
          }
        }, 1000 * timeOutInSecs);

        break;
      }

      case SkillType.Combat: {
        const buffSkill = await this.characterCombatSkillBuff.updateCombatSkill(
          character,
          skillType as CombatSkill,
          buff
        );

        setTimeout(async () => {
          const refreshCharacter = (await Character.findById(character._id).lean()) as ICharacter;
          if (refreshCharacter && refreshCharacter.appliedBuffsEffects) {
            const appliedBuffsEffect = this.buffSkillFunctions.getValueByBuffId(
              refreshCharacter?.appliedBuffsEffects,
              buffSkill._id
            );

            if (appliedBuffsEffect) {
              await this.characterCombatSkillBuff.updateCombatSkill(
                refreshCharacter,
                skillType as CombatSkill,
                buff * -1,
                buffSkill._id
              );
            }
          }
        }, 1000 * timeOutInSecs);

        break;
      }

      case SkillType.Crafting: {
        // update the character crafting gathering skill
        break;
      }

      case SkillType.Character: {
        const buffSkill = await this.characterEntitiesBuff.updateCharacterEntities(
          character._id,
          skillType as CharacterEntities,
          buff
        );

        setTimeout(async () => {
          const refreshCharacter = (await Character.findById(character._id).lean({ virtuals: true })) as ICharacter;

          if (refreshCharacter && refreshCharacter.appliedBuffsEffects) {
            const appliedBuffsEffect = this.buffSkillFunctions.getValueByBuffId(
              refreshCharacter?.appliedBuffsEffects,
              buffSkill._id
            );
            if (appliedBuffsEffect) {
              await this.characterEntitiesBuff.updateCharacterEntities(
                refreshCharacter._id,
                skillType as CharacterEntities,
                buff * -1,
                buffSkill._id
              );
            }
          }
        }, 1000 * timeOutInSecs);

        break;
      }
      default: {
        break;
      }
    }
  }

  public async enableXpBuff(characterId: Types.ObjectId, buff: number): Promise<void> {
    const skillType = "experience";

    if (buff < 0) {
      return;
    }
    await this.buffSkillFunctions.updateBuffXpOnCharacter(characterId, skillType, buff);
  }

  public async disableXpBuff(characterId: Types.ObjectId, debuff: number): Promise<void> {
    const skillType = "experience";

    if (debuff > 0) {
      return;
    }
    await this.buffSkillFunctions.updateBuffXpOnCharacter(characterId, skillType, debuff);
  }
}
