import { CharacterBuff } from "@entities/ModuleCharacter/CharacterBuffModel";
import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { CharacterParty, ICharacterParty } from "@entities/ModuleCharacter/CharacterPartyModel";
import { CharacterBuffActivator } from "@providers/character/characterBuff/CharacterBuffActivator";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import {
  BasicAttribute,
  CharacterBuffDurationType,
  CharacterBuffType,
  CharacterClass,
  ICharacterBuff,
  ICharacterPermanentBuff,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import _ from "lodash";
import mongoose, { Types } from "mongoose";

export interface ICharacterPartyShared {
  id?: string;
  leader: {
    _id: string;
    class: CharacterClass;
  };
  members: {
    _id: string;
    class: CharacterClass;
  }[];
  maxSize: number;
  size?: number;
  benefits?: {
    benefit: CharacterPartyBenefits;
    value: number;
  }[];
}

export enum CharacterPartyBenefits {
  Experience = "experience",
  DropRatio = "drop-ratio",
  Skill = "skill",
  Distribution = "distribution",
}

// Different classes members + leader
export enum CharacterPartyEXPBonus {
  One = 2,
  Two = 4,
  Three = 6,
  Four = 8,
  Five = 10,
}

// number os total members + leader
export enum CharacterPartyDropBonus {
  None = 0,
  Two = 6,
  Three = 9,
  Four = 12,
  Five = 15,
}

// number os total members + leader
export enum CharacterPartySkillBonus {
  None = 0,
  Two = 4,
  Three = 6,
  Four = 8,
  Five = 10,
}

// number os total members + leader
export enum CharacterPartyDistributionBonus {
  None = 1,
  Two = 0.5,
  Three = 0.33,
  Four = 0.25,
  Five = 0.2,
}

@provide(PartyManagement)
export default class PartyManagement {
  constructor(private socketMessaging: SocketMessaging, private characterBuffActivator: CharacterBuffActivator) {}

  // create party
  public async createParty(
    leader: ICharacter,
    target: ICharacter,
    maxSize?: number
  ): Promise<ICharacterParty | undefined> {
    if (!leader) {
      throw new Error("Character not found");
    }

    if (!target) {
      this.sendMessageToPartyMembers(leader, "Target not found");
      return;
    }

    if (leader._id.toString() === target._id.toString()) {
      this.sendMessageToPartyMembers(leader, "You can't create a party with yourself");
      return;
    }

    const isInParty = await this.checkIfIsInParty(leader);

    if (isInParty) {
      this.sendMessageToPartyMembers(leader, "You are already in a party");
      return;
    }

    const targetIsInParty = await this.checkIfIsInParty(target);

    if (targetIsInParty) {
      this.sendMessageToPartyMembers(leader, "Target are already in a party");
      return;
    }

    let finalMaxSize = 5;

    if (typeof maxSize !== "undefined") {
      finalMaxSize = maxSize < 2 ? 2 : maxSize > 5 ? 5 : maxSize;
    }

    const benefits = this.calculatePartyBenefits(2, leader.class !== target.class ? 2 : 1);

    const createParty: ICharacterPartyShared = {
      leader: {
        _id: leader._id,
        class: leader.class as CharacterClass,
      },
      members: [
        {
          _id: target._id,
          class: target.class as CharacterClass,
        },
      ],
      maxSize: finalMaxSize,
      benefits,
    };

    try {
      await CharacterParty.create(createParty).then(async (party) => {
        await this.applyAllBuffInParty(party);

        this.sendMessageToPartyMembers(
          leader,
          `You created a party with ${target.name}!`,
          target,
          `${leader.name} created a party with you!`
        );

        return party;
      });
    } catch (error) {
      console.log(error);
    }
  }

  // invte to a party
  public async inviteToParty(leader: ICharacter, target: ICharacter): Promise<void> {
    if (!leader || !target) {
      throw new Error("Leader or target not found");
    }
    const checkIfIsLeader = await this.checkIfIsLeader(leader._id);

    if (!checkIfIsLeader) {
      this.sendMessageToPartyMembers(leader, "You are not the party leader");
      return;
    }

    const targetIsInParty = await this.checkIfIsInParty(target);

    if (targetIsInParty) {
      this.sendMessageToPartyMembers(leader, "Target is already in a party");
      return;
    }

    // if (!party) {
    //   this.sendMessageToPartyMembers(leader, "You are not in a party");
    //   return;
    // }

    if (!(await this.haveFreeSlots(leader))) {
      this.sendMessageToPartyMembers(leader, "Your party is already full");
      return;
    }

    const party = (await this.getPartyByCharacterId(leader._id)) as ICharacterParty;

    await this.removeAllBuffInParty(party);

    party.members.push({
      _id: target._id,
      class: target.class as CharacterClass,
    });

    const benefits = this.calculatePartyBenefits(party.size + 1, this.getDifferentClasses(party));

    const updatedParty = (await CharacterParty.findByIdAndUpdate(
      party._id,
      {
        leader: {
          _id: leader._id,
          class: leader.class as CharacterClass,
        },
        members: party.members,
        benefits,
      },
      { new: true }
    )) as ICharacterParty;

    await this.applyAllBuffInParty(updatedParty);

    this.sendMessageToPartyMembers(leader, `You invited ${target.name} to your party`);
    this.sendMessageToPartyMembers(target, `${leader.name} invited you to their party`);
  }

  // check if is already in a party
  private async checkIfIsInParty(character: ICharacter): Promise<boolean> {
    const party = (await CharacterParty.findOne({
      $or: [
        { "members._id": mongoose.Types.ObjectId(character._id) },
        { "leader._id": mongoose.Types.ObjectId(character._id) },
      ],
    }).lean()) as ICharacterParty;

    if (!party || party === null) {
      return false;
    }

    const isMember = party.members.some((member) => member._id.toString() === character._id.toString());
    const isLeader = party.leader._id.toString() === character._id.toString();

    return isMember || isLeader;
  }

  // check if is leader
  private async checkIfIsLeader(characterId: string): Promise<boolean> {
    const party = (await CharacterParty.findOne({ "leader._id": characterId })
      .lean()
      .select("leader")) as ICharacterParty;

    if (!party || party === null) {
      return false;
    }

    return party.leader._id.toString() === characterId.toString();
  }

  private async removeMemberFromParty(leaderId: string, memberId: string): Promise<void> {
    const party = await this.getPartyByCharacterId(leaderId);

    if (!party) {
      throw new Error("Party not found");
    }

    await this.removeAllBuffInParty(party);

    const members = party.members.filter((member) => member._id.toString() !== memberId.toString());
    party.members = members;

    const benefits = this.calculatePartyBenefits(party.size - 1, this.getDifferentClasses(party));
    party.benefits = benefits;

    const isLeader = await this.checkIfIsLeader(leaderId);

    if (isLeader && party.members.length === 0) {
      const character = (await Character.findById(leaderId).lean()) as ICharacter;
      await this.deleteParty(character);

      return;
    }

    const updatedParty = (await CharacterParty.findByIdAndUpdate(party._id, party, { new: true })) as ICharacterParty;

    await this.applyAllBuffInParty(updatedParty);
  }

  public async leaveParty(leader: ICharacter, target: ICharacter): Promise<void> {
    const isLeader = await this.checkIfIsLeader(leader._id);
    const isSameCharacter = leader._id.toString() === target._id.toString();

    if (isSameCharacter) {
      if (isLeader) {
        await this.deleteParty(leader);
      } else {
        await this.removeMemberFromParty(leader._id, leader._id);
        this.sendMessageToPartyMembers(leader, "You left the party");
      }
    } else {
      if (isLeader) {
        if (!(await this.checkIfSameParty(leader, target))) {
          this.sendMessageToPartyMembers(leader, "The target character is not in your party");
        } else {
          await this.removeMemberFromParty(leader._id, target._id);
          this.sendMessageToPartyMembers(leader, `You removed ${target.name} from the party`);
          this.sendMessageToPartyMembers(target, "You left the party");
        }
      } else {
        this.sendMessageToPartyMembers(leader, "You can't remove other members from the party");
      }
    }
  }

  private async checkIfSameParty(leader: ICharacter, target: ICharacter): Promise<boolean> {
    const leaderParty = await this.getPartyByCharacterId(leader._id);
    const targetParty = await this.getPartyByCharacterId(target._id);

    if (!leaderParty || !targetParty) {
      return false;
    }

    return leaderParty._id.toString() === targetParty._id.toString();
  }

  private async deleteParty(leader: ICharacter): Promise<void> {
    const isInParty = await this.checkIfIsInParty(leader);

    if (!isInParty) {
      this.sendMessageToPartyMembers(leader, "You are not in a party");
      return;
    }

    const isLeader = await this.checkIfIsLeader(leader._id);

    if (!isLeader) {
      this.sendMessageToPartyMembers(leader, "You are not the party leader");
      return;
    }

    const party = (await this.getPartyByCharacterId(leader._id)) as ICharacterParty;

    await this.removeAllBuffInParty(party);

    await CharacterParty.deleteOne({ "leader._id": leader._id });

    this.sendMessageToPartyMembers(leader, "You have deleted the party");
  }

  // check actual free slots
  private async haveFreeSlots(leader: ICharacter): Promise<boolean> {
    const party = (await CharacterParty.findOne({ "leader._id": leader._id })
      .lean({ virtuals: true })
      .select("maxSize size")) as ICharacterParty;

    if (!party) {
      return false;
    }

    const maxSize = party.maxSize;
    const actualSize = party.size;

    if (actualSize! >= maxSize) {
      return false;
    }

    return true;
  }

  public async getPartyByCharacterId(characterId: string): Promise<ICharacterParty | null> {
    const party = (await CharacterParty.findOne({
      $or: [{ "leader._id": characterId }, { "members._id": characterId }],
    }).lean({ virtuals: true })) as ICharacterParty;

    return party || null;
  }

  // transfer party leadership
  public async transferLeadership(leader: ICharacter, target: ICharacter, removeLeader?: boolean): Promise<void> {
    const inSameParty = await this.checkIfSameParty(leader, target);

    if (!inSameParty) {
      this.sendMessageToPartyMembers(leader, "The target character is not in your party");
      return;
    }
    const checkIfIsLeader = await this.checkIfIsLeader(leader._id);

    if (!checkIfIsLeader) {
      this.sendMessageToPartyMembers(leader, "You are not the party leader");
      return;
    }

    const party = (await CharacterParty.findOne({ "leader._id": leader._id }).lean()) as ICharacterParty;

    if (!party) {
      throw new Error("Party not found");
    }

    party.leader = {
      _id: target._id,
      class: target.class as CharacterClass,
    };

    const index = party.members.findIndex((member) => member._id.toString() === target._id.toString());

    if (index !== -1) {
      party.members.splice(index, 1);
    }

    if (removeLeader) {
      const leaderIndex = party.members.findIndex((member) => member._id.toString() === leader._id.toString());

      if (leaderIndex !== -1) {
        party.members.splice(leaderIndex, 1);
      }

      await this.removeAllBuffInParty(party);
    } else {
      party.members.push({
        _id: leader._id,
        class: leader.class as CharacterClass,
      });
    }

    const benefits = this.calculatePartyBenefits(party.size, this.getDifferentClasses(party));
    party.benefits = benefits;

    const updatedParty = (await CharacterParty.findByIdAndUpdate(party._id, party, { new: true })) as ICharacterParty;

    if (removeLeader) {
      await this.applyAllBuffInParty(updatedParty);
    }
  }

  private sendMessageToPartyMembers(
    leader: ICharacter,
    messageToLeader: string,
    target?: ICharacter,
    messageToTarget?: string
  ): void {
    this.socketMessaging.sendErrorMessageToCharacter(leader, messageToLeader);

    if (target && messageToTarget) {
      this.socketMessaging.sendErrorMessageToCharacter(target, messageToTarget);
    }
  }

  public calculatePartyBenefits(
    numberOfMembers: number,
    differentClasses: number
  ): { benefit: CharacterPartyBenefits; value: number }[] {
    const bonusMapping = {
      2: {
        distribution: CharacterPartyDistributionBonus.Two,
        dropRatio: CharacterPartyDropBonus.Two,
        skill: CharacterPartySkillBonus.Two,
      },
      3: {
        distribution: CharacterPartyDistributionBonus.Three,
        dropRatio: CharacterPartyDropBonus.Three,
        skill: CharacterPartySkillBonus.Three,
      },
      4: {
        distribution: CharacterPartyDistributionBonus.Four,
        dropRatio: CharacterPartyDropBonus.Four,
        skill: CharacterPartySkillBonus.Four,
      },
      5: {
        distribution: CharacterPartyDistributionBonus.Five,
        dropRatio: CharacterPartyDropBonus.Five,
        skill: CharacterPartySkillBonus.Five,
      },
    };

    const defaultBonus = {
      distribution: CharacterPartyDistributionBonus.None,
      dropRatio: CharacterPartyDropBonus.None,
      skill: CharacterPartySkillBonus.None,
    };

    const bonuses = _.get(bonusMapping, numberOfMembers, defaultBonus);

    const distributionBonus = bonuses.distribution;
    const dropRatioBonus = bonuses.dropRatio;
    const skillBonus = bonuses.skill;

    const expBonusMapping = {
      1: CharacterPartyEXPBonus.One,
      2: CharacterPartyEXPBonus.Two,
      3: CharacterPartyEXPBonus.Three,
      4: CharacterPartyEXPBonus.Four,
      5: CharacterPartyEXPBonus.Five,
    };

    const experienceBonus = _.get(expBonusMapping, differentClasses, CharacterPartyEXPBonus.One);

    return [
      {
        benefit: CharacterPartyBenefits.Distribution,
        value: distributionBonus,
      },
      {
        benefit: CharacterPartyBenefits.Experience,
        value: experienceBonus,
      },
      {
        benefit: CharacterPartyBenefits.DropRatio,
        value: dropRatioBonus,
      },
      {
        benefit: CharacterPartyBenefits.Skill,
        value: skillBonus,
      },
    ];
  }

  public getDifferentClasses(party: ICharacterParty): number {
    const leaderClass = party.leader.class;
    const memberClasses = party.members.map((member) => member.class);

    memberClasses.push(leaderClass);
    const uniqueClasses = new Set(memberClasses);

    return uniqueClasses.size;
  }

  public async applyBuffSkill(characterId: string, buffPercentage: number): Promise<void> {
    const character = (await Character.findById(characterId).lean()) as ICharacter;

    let traits = [BasicAttribute.Strength, BasicAttribute.Resistance];
    if (character.class === CharacterClass.Druid || character.class === CharacterClass.Sorcerer) {
      traits = [BasicAttribute.Magic, BasicAttribute.MagicResistance];
    }

    const applyBuffTasks = traits.map((trait) => this.applyCharacterBuff(character, trait, buffPercentage));

    try {
      await Promise.all(applyBuffTasks);
    } catch (error) {
      console.error("Error applying buff to character:", error);
    }
  }

  private async applyCharacterBuff(character: ICharacter, trait: string, buffPercentage: number): Promise<void> {
    const buff = {
      type: CharacterBuffType.Skill,
      trait,
      buffPercentage,
      durationType: CharacterBuffDurationType.Permanent,
    } as ICharacterPermanentBuff;

    await this.characterBuffActivator.enablePermanentBuff(character, buff, true);
  }

  public async removeBuffSkill(characterId: string, buffPercentage: number): Promise<void> {
    const character = (await Character.findById(characterId).lean()) as ICharacter;

    let traits = [BasicAttribute.Strength, BasicAttribute.Resistance];
    if (character.class === CharacterClass.Druid || character.class === CharacterClass.Sorcerer) {
      traits = [BasicAttribute.Magic, BasicAttribute.MagicResistance];
    }

    const removeBuffTasks = traits.map((trait) => this.removeCharacterBuff(character, trait, buffPercentage));

    try {
      await Promise.all(removeBuffTasks);
    } catch (error) {
      console.error("Error removing buff from character:", error);
    }
  }

  private async removeCharacterBuff(character: ICharacter, trait: string, buffPercentage: number): Promise<void> {
    const buff = (await CharacterBuff.findOne({
      owner: character._id,
      trait,
      buffPercentage,
      durationType: CharacterBuffDurationType.Permanent,
    })) as ICharacterBuff;

    if (!buff) {
      throw new Error("Remove Buff not found");
    }

    await this.characterBuffActivator.disableBuff(character, buff._id!, CharacterBuffType.Skill, true);
  }

  public async removeAllBuffInParty(party: ICharacterParty): Promise<void> {
    const differentClasses = this.getDifferentClasses(party);
    const numberOfMembers = party.size ?? party.members.length + 1;

    const benefits = this.calculatePartyBenefits(numberOfMembers, differentClasses);

    const skillBenefit = benefits.find((benefit) => benefit.benefit === CharacterPartyBenefits.Skill);

    if (!skillBenefit) {
      throw new Error("Skill benefit not found");
    }

    const { leader, members } = party;

    if (!leader._id) {
      throw new Error("Leader id not found");
    }

    const removeBuffTasks = [
      this.removeBuffSkill(leader._id as string, skillBenefit.value),
      ...members.map((member) =>
        member._id ? this.removeBuffSkill(member._id as string, skillBenefit.value) : Promise.resolve()
      ),
    ];

    try {
      await Promise.all(removeBuffTasks);
    } catch (error) {
      console.error("Error removing buff from party:", error);
    }
  }

  public async applyAllBuffInParty(party: ICharacterParty): Promise<void> {
    const differentClasses = this.getDifferentClasses(party);
    const numberOfMembers = party.size ?? party.members.length + 1;

    const benefits = this.calculatePartyBenefits(numberOfMembers, differentClasses);

    const skillBenefit = benefits.find((benefit) => benefit.benefit === CharacterPartyBenefits.Skill);

    if (!skillBenefit) {
      throw new Error("Skill benefit not found");
    }

    const { leader, members } = party;

    if (!leader || !members) {
      throw new Error("Party leader or members not defined");
    }

    const buffTasks = [
      this.applyBuffSkill(leader._id as string, skillBenefit.value),
      ...members.map((member) => (member._id ? this.applyBuffSkill(member._id as string, skillBenefit.value) : null)),
    ].filter(Boolean);

    try {
      await Promise.all(buffTasks);
    } catch (error) {
      console.error("Error applying buff to party:", error);
    }
  }

  public async clearAllParties(): Promise<void> {
    const allPartys = (await CharacterParty.find({}).lean()) as ICharacterParty[];

    const removeTasks = allPartys.map(async (party) => {
      try {
        await this.removeAllBuffInParty(party);
        await CharacterParty.findByIdAndDelete(party._id);
      } catch (error) {
        console.log("Error removing party buffs", error);
      }
    });

    await Promise.all(removeTasks);
  }
}
