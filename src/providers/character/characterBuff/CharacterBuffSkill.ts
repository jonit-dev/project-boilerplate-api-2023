import { Skill } from "@entities/ModuleCharacter/SkillsModel";

import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { TextFormatter } from "@providers/text/TextFormatter";
import { ICharacterBuff, SkillSocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

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

  public async enableBuff(character: ICharacter, buff: ICharacterBuff): Promise<string> {
    const skill = await Skill.findById(character.skills);

    if (!skill) {
      throw new Error("Skill not found");
    }

    const prevSkill = skill[buff.trait] as ISkillDetail;
    const prevSkillLevel = prevSkill.level;

    const updatedSkillLevel = Math.round(prevSkillLevel + prevSkillLevel * (buff.buffPercentage / 100));

    // save model

    await Skill.updateOne(
      { _id: skill._id },
      {
        [buff.trait]: {
          ...prevSkill,
          level: updatedSkillLevel,
        },
      }
    );

    // then register the buff on redis (so we can rollback when needed)

    buff.prevTraitValue = prevSkillLevel;

    const buffId = await this.characterBuffTracker.addBuff(character, buff);

    if (!buffId) {
      throw new Error("Could not add buff to character");
    }

    await this.sendUpdateToClient(character, buff);

    return buffId;
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

    const prevTraitValue = buff.prevTraitValue as number;

    // save previous skill level on model
    await Skill.updateOne(
      { _id: skills._id },
      {
        [buff.trait]: {
          ...skillDetails,
          level: prevTraitValue,
        },
      }
    );

    // then delete the buff from redis

    await this.characterBuffTracker.deleteBuff(character, buff._id!);

    if (!buff.options?.messages?.skipMessages) {
      this.socketMessaging.sendMessageToCharacter(
        character,
        buff.options?.messages?.activation ||
          `Your skill ${this.textFormatter.convertCamelCaseToSentence(buff.trait)} has been debuffed by ${
            buff.buffPercentage
          }%!`
      );
    }

    return true;
  }

  private async sendUpdateToClient(character: ICharacter, buff: ICharacterBuff): Promise<void> {
    const skill = await Skill.findById(character.skills);

    if (!skill) {
      throw new Error("Skill not found");
    }

    this.socketMessaging.sendEventToUser(character.channelId!, SkillSocketEvents.ReadInfo, {
      skill,
    });

    if (!buff.options?.messages?.skipMessages) {
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
