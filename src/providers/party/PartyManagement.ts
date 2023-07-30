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
  CharacterPartyBenefits,
  CharacterPartyDistributionBonus,
  CharacterPartyDropBonus,
  CharacterPartyEXPBonus,
  CharacterPartySkillBonus,
  ICharacterBuff,
  ICharacterPartyShared,
  ICharacterPermanentBuff,
  PartySocketEvents,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import _ from "lodash";
import mongoose from "mongoose";

@provide(PartyManagement)
export default class PartyManagement {
  constructor(private socketMessaging: SocketMessaging, private characterBuffActivator: CharacterBuffActivator) {}

  // invite or create a party
  public async inviteOrCreateParty(leader: ICharacter, target: ICharacter, maxSize?: number): Promise<void> {
    if (!leader) {
      throw new Error("Character not found");
    }

    if (!target) {
      this.socketMessaging.sendErrorMessageToCharacter(leader, "Target not found");
      return;
    }

    const isInParty = await this.checkIfIsInParty(leader);
    isInParty ? await this.inviteToParty(leader, target) : await this.createParty(leader, target, maxSize);
  }

  public async acepptInvite(leader: ICharacter, target: ICharacter): Promise<void> {
    // #region #TODO: create a common function to this validators. <1>
    const targetIsInParty = await this.checkIfIsInParty(target);
    if (targetIsInParty) {
      this.sendMessageToPartyMembers(leader, "Target is already in a party");
      return;
    }

    if (!(await this.haveFreeSlots(leader))) {
      this.sendMessageToPartyMembers(leader, "The party is already full");
      return;
    }
    // #endregion

    const party = (await this.getPartyByCharacterId(leader._id)) as ICharacterParty;
    await this.removeAllBuffInParty(party);
    party.members.push({
      _id: target._id,
      class: target.class as CharacterClass,
      name: target.name,
    });
    const benefits = this.calculatePartyBenefits(party.size + 1, this.getDifferentClasses(party));
    const updatedParty = (await CharacterParty.findByIdAndUpdate(
      party._id,
      {
        // leader: {
        //   _id: leader._id,
        //   class: leader.class as CharacterClass,
        //   name: leader.name,
        // },
        members: party.members,
        benefits,
      },
      { new: true }
    )) as ICharacterParty;

    await this.applyAllBuffInParty(updatedParty);

    this.sendMessageToPartyMembers(leader, `${target.name} joined the party`);
  }

  public async leaveParty(leader: ICharacter, target: ICharacter): Promise<void> {
    const isLeader = await this.checkIfIsLeader(leader._id);
    const isSameCharacter = leader._id.toString() === target._id.toString();

    if (isSameCharacter) {
      if (isLeader) {
        await this.deleteParty(leader);
      } else {
        await this.removeMemberFromParty(leader, leader._id);
        this.sendMessageToPartyMembers(leader, "You left the party");
      }
    } else {
      if (isLeader) {
        if (!(await this.checkIfSameParty(leader, target))) {
          this.sendMessageToPartyMembers(leader, "The target character is not in your party");
        } else {
          await this.removeMemberFromParty(leader, target._id);
          this.sendMessageToPartyMembers(leader, `You removed ${target.name} from the party`);
          this.sendMessageToPartyMembers(target, "You left the party");
        }
      } else {
        this.sendMessageToPartyMembers(leader, "You can't remove other members from the party");
      }
    }
  }

  public async partyInfoRead(character: ICharacter): Promise<void> {
    const party = (await this.getPartyByCharacterId(character._id)) as ICharacterParty;

    if (!party) {
      this.sendMessageToPartyMembers(character, "An error occour on loading party data, try latter.");
      return;
    }

    // #TODO: create a function to centralize the emiters <3>
    const partyInfoData: ICharacterPartyShared = (party as unknown as ICharacterPartyShared) ?? null;
    this.socketMessaging.sendEventToUser<ICharacterPartyShared>(
      character?.channelId!,
      PartySocketEvents.PartyInfoOpen,
      partyInfoData
    );
  }

  // create party
  private async createParty(
    leader: ICharacter,
    target: ICharacter,
    maxSize?: number
  ): Promise<ICharacterParty | undefined> {
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
        name: leader.name,
      },
      members: [
        {
          _id: leader._id,
          class: leader.class as CharacterClass,
          name: leader.name,
        },
      ],
      maxSize: finalMaxSize,
      benefits,
    };

    try {
      const party = await CharacterParty.create(createParty);

      if (party) {
        await this.applyAllBuffInParty(party);

        // #TODO: create a common function for this emmiter.
        // Send Confirmation message to target
        this.socketMessaging.sendEventToUser(target?.channelId!, PartySocketEvents.PartyInvite, {
          leaderId: leader._id,
          leaderName: leader.name,
        });
      }
      /*
      this.sendMessageToPartyMembers(
        leader,
        `You created a party with ${target.name}!`,
        target,
        `${leader.name} created a party with you!`
      );
      */
      return party;
    } catch (error) {
      console.error(error);
    }
  }

  // invte to a party
  private async inviteToParty(leader: ICharacter, target: ICharacter): Promise<void> {
    if (!leader || !target) {
      throw new Error("Leader or target not found");
    }

    /* Valida se o lider é lider da party ???? */
    const checkIfIsLeader = await this.checkIfIsLeader(leader._id);
    if (!checkIfIsLeader) {
      this.sendMessageToPartyMembers(leader, "You are not the party leader");
      return;
    }

    // #region #TODO: create a common function to this validators. <1>
    const targetIsInParty = await this.checkIfIsInParty(target);
    if (targetIsInParty) {
      this.sendMessageToPartyMembers(leader, "Target is already in a party");
      return;
    }

    if (!(await this.haveFreeSlots(leader))) {
      this.sendMessageToPartyMembers(leader, "Your party is already full");
      return;
    }
    // #endregion

    // #TODO: create a common function for this emmiter.
    // Send Confirmation message to target
    this.socketMessaging.sendEventToUser(target?.channelId!, PartySocketEvents.PartyInvite, {
      leaderId: leader._id,
      leaderName: leader.name,
    });

    /*
    const party = (await this.getPartyByCharacterId(leader._id)) as ICharacterParty;
    await this.removeAllBuffInParty(party);
    party.members.push({
      _id: target._id,
      class: target.class as CharacterClass,
      name: target.name,
    });
    const benefits = this.calculatePartyBenefits(party.size + 1, this.getDifferentClasses(party));
    const updatedParty = (await CharacterParty.findByIdAndUpdate(
      party._id,
      {
        leader: {
          _id: leader._id,
          class: leader.class as CharacterClass,
          name: leader.name,
        },
        members: party.members,
        benefits,
      },
      { new: true }
    )) as ICharacterParty;

    await this.applyAllBuffInParty(updatedParty);

    this.sendMessageToPartyMembers(leader, `You invited ${target.name} to your party`);
    this.sendMessageToPartyMembers(target, `${leader.name} invited you to their party`);
    */
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

  private async removeMemberFromParty(leader: ICharacter, memberId: string): Promise<void> {
    const party = await this.getPartyByCharacterId(leader._id);

    if (!party) {
      throw new Error("Party not found");
    }

    await this.removeAllBuffInParty(party);

    const members = party.members.filter((member) => member._id.toString() !== memberId.toString());
    party.members = members;

    const benefits = this.calculatePartyBenefits(party.size - 1, this.getDifferentClasses(party));
    party.benefits = benefits;

    const isLeader = await this.checkIfIsLeader(leader._id);

    if (isLeader && party.members.length === 0) {
      const character = (await Character.findById(leader._id).lean()) as ICharacter;
      await this.deleteParty(character);

      return;
    }

    const updatedParty = (await CharacterParty.findByIdAndUpdate(party._id, party, { new: true })) as ICharacterParty;
    await this.applyAllBuffInParty(updatedParty);

    await this.partyInfoRead(leader);
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

    let party = (await this.getPartyByCharacterId(leader._id)) as ICharacterParty;
    await this.removeAllBuffInParty(party);
    await CharacterParty.deleteOne({ "leader._id": leader._id });

    party = (await this.getPartyByCharacterId(leader._id)) as ICharacterParty;

    // #TODO: create a function to centralize the emiters <3>
    this.socketMessaging.sendEventToUser<ICharacterPartyShared>(
      leader?.channelId!,
      PartySocketEvents.PartyInfoOpen,
      party as unknown as ICharacterPartyShared
    );
    this.sendMessageToPartyMembers(leader, "You have deleted the party");
  }

  // check actual free slots
  private async haveFreeSlots(leader: ICharacter): Promise<boolean> {
    console.log(leader._id);
    const party = (await CharacterParty.findOne({ "leader._id": leader._id })
      .lean({ virtuals: true })
      .select("maxSize size members")) as ICharacterParty;

    if (!party) {
      console.log("False 1");
      return false;
    }

    const maxSize = party.maxSize;
    const actualSize = party.size;

    if (actualSize! >= maxSize) {
      console.log("False 2");
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
      name: target.name,
    };

    const updatedParty = (await CharacterParty.findByIdAndUpdate(party._id, party, { new: true })) as ICharacterParty;

    // #TODO: create a function to centralize the emiters <3>
    this.socketMessaging.sendEventToUser<ICharacterPartyShared>(
      leader?.channelId!,
      PartySocketEvents.PartyInfoOpen,
      updatedParty as unknown as ICharacterPartyShared
    );

    /*
    const index = party.members.findIndex((member) => member._id.toString() === target._id.toString());
    if (index !== -1) {
      party.members.splice(index, 1);
    }
    */

    /*
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
        name: leader.name,
      });
    }
    */
    // const benefits = this.calculatePartyBenefits(party.size, this.getDifferentClasses(party));
    // party.benefits = benefits;

    // if (removeLeader) {
    //   await this.applyAllBuffInParty(updatedParty);
    // }
  }

  // #TODO: This function is supose to sent a message to all party members.
  // But now is sending error messages just for the leader and target??
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
