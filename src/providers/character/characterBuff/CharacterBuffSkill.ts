import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";

import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { TextFormatter } from "@providers/text/TextFormatter";
import { CharacterTrait, ICharacterBuff, SkillSocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

import { IBuffValueCalculations } from "./CharacterBuffAttribute";
import { CharacterBuffTracker } from "./CharacterBuffTracker";

interface ISkillDetail {
  type: string;
  level: number;
  skillPoints: number;
  skillPointsToNextLevel: number;
  lastSkillGain: Date;
}

@provide(CharacterBuffSkill)
export class CharacterBuffSkill {
  constructor(
    private characterBuffTracker: CharacterBuffTracker,
    private socketMessaging: SocketMessaging,
    private textFormatter: TextFormatter
  ) {}

  public async enableBuff(character: ICharacter, buff: ICharacterBuff): Promise<ICharacterBuff> {
    const skill = await Skill.findById(character.skills);

    if (!skill) {
      throw new Error("Skill not found");
    }
    const skilDetails = skill[buff.trait] as ISkillDetail;

    const { buffAbsoluteChange, updatedTraitValue } = await this.performBuffValueCalculations(character, buff);

    // save model

    await Skill.updateOne(
      { _id: skill._id },
      {
        [buff.trait]: {
          ...skilDetails,
          level: updatedTraitValue.toFixed(2),
        },
      }
    );

    // then register the buff on redis (so we can rollback when needed)

    buff.absoluteChange = buffAbsoluteChange;

    const addedBuff = (await this.characterBuffTracker.addBuff(character, buff)) as ICharacterBuff;

    if (!addedBuff) {
      throw new Error("Could not add buff to character");
    }

    await this.sendUpdateToClient(character, buff);

    return addedBuff;
  }

  public async disableBuff(character: ICharacter, buffId: string): Promise<boolean> {
    const skills = await Skill.findById(character.skills);

    if (!skills) {
      throw new Error("Skill not found");
    }

    // rollback model changes
    const buff = await this.characterBuffTracker.getBuff(character, buffId);

    if (!buff) {
      return false;
    }

    const skillDetails = skills[buff.trait] as ISkillDetail;

    const currentBuffValue = skillDetails.level;

    const debuffValue = buff.absoluteChange!;

    const updatedTraitValue = Number((currentBuffValue - debuffValue).toFixed(2));

    // then delete the buff from redis

    const hasDeletedBuff = await this.characterBuffTracker.deleteBuff(character, buff._id!);

    if (!hasDeletedBuff) {
      throw new Error("Could not delete buff from character");
    }

    // save previous skill level on model
    await Skill.updateOne(
      { _id: skills._id },
      {
        [buff.trait]: {
          ...skillDetails,
          level: updatedTraitValue,
        },
      }
    );

    if (!buff.options?.messages?.skipAllMessages && !buff.options?.messages?.activation) {
      this.socketMessaging.sendMessageToCharacter(
        character,
        buff.options?.messages?.activation ||
          `Your skill ${this.textFormatter.convertCamelCaseToSentence(buff.trait)} has been buffed by ${
            buff.buffPercentage
          }%!`
      );
    }

    await this.sendUpdateToClient(character, buff);

    return true;
  }

  public async getSkillLevelWithoutBuffs(character: ICharacter, skills: ISkill, skillName: string): Promise<number> {
    if (skills.ownerType !== "Character") {
      return skills[skillName].level;
    }

    const skillDetails = skills[skillName] as ISkillDetail;

    const totalTraitSummedBuffs = await this.characterBuffTracker.getAllBuffAbsoluteChanges(
      character,
      skillName as CharacterTrait
    );

    return skillDetails.level - totalTraitSummedBuffs;
  }

  private async performBuffValueCalculations(
    character: ICharacter,
    buff: ICharacterBuff
  ): Promise<IBuffValueCalculations> {
    const totalTraitSummedBuffs = await this.characterBuffTracker.getAllBuffAbsoluteChanges(character, buff.trait);

    const updatedSkills = (await Skill.findOne({
      owner: character._id,
    }).lean()) as ICharacter;

    if (!updatedSkills) {
      throw new Error("Character not found");
    }

    const skillDetails = updatedSkills[buff.trait] as ISkillDetail;

    const baseTraitValue = Number((skillDetails.level - totalTraitSummedBuffs).toFixed(2));

    // Calculate the new buffed value by applying the percentage buff on the BASE VALUE (additive buff!)
    const updatedTraitValue =
      Number((baseTraitValue * (1 + buff.buffPercentage / 100)).toFixed(2)) + totalTraitSummedBuffs;

    // Calculate the absolute change of the new buff
    const buffAbsoluteChange = Number((updatedTraitValue - baseTraitValue).toFixed(2)) - totalTraitSummedBuffs;

    return {
      baseTraitValue,
      buffAbsoluteChange,
      updatedTraitValue,
    };
  }

  private async sendUpdateToClient(character: ICharacter, buff: ICharacterBuff): Promise<void> {
    const skill = await Skill.findById(character.skills);

    if (!skill) {
      throw new Error("Skill not found");
    }

    this.socketMessaging.sendEventToUser(character.channelId!, SkillSocketEvents.ReadInfo, {
      skill,
    });

    if (!buff.options?.messages?.skipAllMessages && !buff.options?.messages?.deactivation) {
      this.socketMessaging.sendMessageToCharacter(
        character,
        buff.options?.messages?.deactivation ||
          `Your skill ${this.textFormatter.convertCamelCaseToSentence(buff.trait)} has been buffed by ${
            buff.buffPercentage
          }%!`
      );
    }
  }
}
