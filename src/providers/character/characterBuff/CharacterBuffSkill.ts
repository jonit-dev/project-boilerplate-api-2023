import { Skill } from "@entities/ModuleCharacter/SkillsModel";

import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { TextFormatter } from "@providers/text/TextFormatter";
import { ICharacterBuff, ISkill, ISkillDetails, SkillSocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

import { SkillBuff } from "@providers/skill/SkillBuff";
import { IBuffValueCalculations } from "./CharacterBuffAttribute";
import { CharacterBuffTracker } from "./CharacterBuffTracker";

@provide(CharacterBuffSkill)
export class CharacterBuffSkill {
  constructor(
    private characterBuffTracker: CharacterBuffTracker,
    private socketMessaging: SocketMessaging,
    private textFormatter: TextFormatter,
    private skillBuff: SkillBuff
  ) {}

  public async enableBuff(character: ICharacter, buff: ICharacterBuff, noMessage?: boolean): Promise<ICharacterBuff> {
    const skill = (await Skill.findById(character.skills)
      .lean()
      .cacheQuery({
        cacheKey: `${character?._id}-skills`,
      })) as unknown as ISkill;

    if (!skill) {
      throw new Error("Skill not found");
    }

    const { buffAbsoluteChange } = await this.performBuffValueCalculations(character, buff);

    // save model

    // then register the buff on redis (so we can rollback when needed)

    buff.absoluteChange = buffAbsoluteChange;

    const addedBuff = (await this.characterBuffTracker.addBuff(character._id, buff)) as ICharacterBuff;

    if (!addedBuff) {
      throw new Error("Could not add buff to character");
    }

    await this.sendUpdateToClient(character, buff, "activation", noMessage);

    return addedBuff;
  }

  public async disableBuff(character: ICharacter, buffId: string, noMessage?: boolean): Promise<boolean> {
    const skills = (await Skill.findById(character.skills)
      .lean()
      .cacheQuery({
        cacheKey: `${character?._id}-skills`,
      })) as unknown as ISkill;

    if (!skills) {
      throw new Error("Skill not found");
    }

    // rollback model changes
    const buff = await this.characterBuffTracker.getBuff(character._id, buffId);

    if (!buff) {
      return false;
    }

    // then delete the buff from redis

    const hasDeletedBuff = await this.characterBuffTracker.deleteBuff(character, buff._id!);

    if (!hasDeletedBuff) {
      throw new Error("Could not delete buff from character");
    }

    await this.sendUpdateToClient(character, buff, "deactivation", noMessage);

    return true;
  }

  private async performBuffValueCalculations(
    character: ICharacter,
    buff: ICharacterBuff
  ): Promise<IBuffValueCalculations> {
    const totalTraitSummedBuffs = await this.characterBuffTracker.getAllBuffPercentageChanges(
      character._id,
      buff.trait
    );

    const updatedSkills = (await Skill.findOne({
      owner: character._id,
    }).lean()) as ICharacter;

    if (!updatedSkills) {
      throw new Error("Character not found");
    }

    const skillDetails = updatedSkills[buff.trait] as ISkillDetails;

    const baseTraitValue = Number(skillDetails.level.toFixed(2));

    // Calculate the new buffed value by applying the percentage buff on the BASE VALUE (additive buff!)
    const updatedTraitValue = Number((baseTraitValue * (1 + totalTraitSummedBuffs / 100)).toFixed(2));

    // Calculate the absolute change of the new buff
    const buffAbsoluteChange = Number((updatedTraitValue - baseTraitValue).toFixed(2));

    return {
      baseTraitValue,
      buffAbsoluteChange,
      updatedTraitValue,
    };
  }

  private async sendUpdateToClient(
    character: ICharacter,
    buff: ICharacterBuff,
    type: "activation" | "deactivation",
    noMessage?: boolean
  ): Promise<void> {
    const skill = await this.skillBuff.getSkillsWithBuff(character);

    if (!skill) {
      throw new Error("Skill not found");
    }

    const buffs = await this.calculateAllActiveBuffs(character);

    this.socketMessaging.sendEventToUser(character.channelId!, SkillSocketEvents.ReadInfo, {
      skill,
      buffs,
    });

    if (noMessage) {
      this.sendCharacterActivationDeactivationMessage(character, buff, type);
    }
  }

  public async calculateAllActiveBuffs(character: ICharacter): Promise<ICharacterBuff[] | undefined> {
    if (!character) {
      throw new Error("Character not found");
    }

    const characterBuffs = await this.characterBuffTracker.getAllCharacterBuffs(character._id);
    if (!characterBuffs) {
      return;
    }

    const buffSet = characterBuffs.reduce((set: Set<ICharacterBuff>, buff) => {
      if (!buff) return set;

      const { trait, buffPercentage = 0, absoluteChange = 0 } = buff;

      const existingBuff = Array.from(set).find((b) => b.trait === trait);
      if (existingBuff) {
        existingBuff.buffPercentage += buffPercentage;
        existingBuff.absoluteChange! += absoluteChange;
      } else {
        const { _id, options, ...cleanBuff } = buff;

        set.add(cleanBuff);
      }

      return set;
    }, new Set<ICharacterBuff>());

    return Array.from(buffSet);
  }

  private sendCharacterActivationDeactivationMessage(
    character: ICharacter,
    buff: ICharacterBuff,
    type: "activation" | "deactivation"
  ): void {
    if (buff.options?.messages?.skipAllMessages === true) {
      return;
    }

    switch (type) {
      case "activation":
        this.socketMessaging.sendMessageToCharacter(
          character,
          buff.options?.messages?.activation ||
            `Your skill ${this.textFormatter.convertCamelCaseToSentence(buff.trait)} has been buffed by ${
              buff.buffPercentage
            }%!`
        );
        break;
      case "deactivation":
        this.socketMessaging.sendMessageToCharacter(
          character,
          buff.options?.messages?.deactivation ||
            `Your skill ${this.textFormatter.convertCamelCaseToSentence(buff.trait)} has been debuffed by -${
              buff.buffPercentage
            }%!`
        );
        break;
    }
  }
}
