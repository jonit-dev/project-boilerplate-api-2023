import { CharacterBuff } from "@entities/ModuleCharacter/CharacterBuffModel";
import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { CharacterParty, ICharacterParty } from "@entities/ModuleCharacter/CharacterPartyModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
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
  IUIShowMessage,
  PartySocketEvents,
  UISocketEvents,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import _ from "lodash";
import mongoose, { Types } from "mongoose";

@provide(PartyManagement)
export default class PartyManagement {
  constructor(private socketMessaging: SocketMessaging, private characterBuffActivator: CharacterBuffActivator) {}

  public async partyInfoRead(member: ICharacter): Promise<void> {
    const party = (await this.getPartyByCharacterId(member._id)) as ICharacterParty;
    const partyInfoData: ICharacterPartyShared = (party as unknown as ICharacterPartyShared) ?? null;
    this.socketMessaging.sendEventToUser<ICharacterPartyShared>(
      member?.channelId!,
      PartySocketEvents.PartyInfoOpen,
      partyInfoData
    );
  }

  // #TODO REMOVE
  public async inviteOrCreateParty(leader: ICharacter, target: ICharacter, character: ICharacter): Promise<void> {
    if (!character) {
      throw new Error("Character not found");
    }

    if (!target) {
      this.socketMessaging.sendErrorMessageToCharacter(leader, "Target not found");
      return;
    }

    const isInParty = await this.checkIfIsInParty(leader);
    isInParty ? this.inviteToParty(leader, target, character) : await this.createParty(character, target);
  }

  public async acepptInvite(leader: ICharacter, target: ICharacter, character: ICharacter): Promise<void> {
    const isPartyExist = await this.checkIfIsInParty(leader);

    isPartyExist ? await this.addMemberToParty(leader, target, character) : await this.createParty(leader, target);
  }

  private async addMemberToParty(leader: ICharacter, target: ICharacter, character: ICharacter): Promise<void> {
    const targetIsInParty = await this.checkIfIsInParty(target);
    if (targetIsInParty) {
      this.socketMessaging.sendEventToUser<IUIShowMessage>(leader.channelId!, UISocketEvents.ShowMessage, {
        message: `${target.name} already is in a party`,
        type: "info",
      });
      return;
    }

    if (!(await this.haveFreeSlots(leader))) {
      this.socketMessaging.sendEventToUser<IUIShowMessage>(leader.channelId!, UISocketEvents.ShowMessage, {
        message: "The party is already full",
        type: "info",
      });
      return;
    }

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

    const partyInfoData = updatedParty as unknown as ICharacterPartyShared;
    void this.sendMessageToPartyMembers(`${target.name} joined the party`, partyInfoData, true);
  }

  private async createParty(
    leader: ICharacter,
    target: ICharacter,
    maxSize?: number
  ): Promise<ICharacterParty | undefined> {
    const targetIsInParty = await this.checkIfIsInParty(target);
    if (targetIsInParty) {
      this.socketMessaging.sendEventToUser<IUIShowMessage>(leader.channelId!, UISocketEvents.ShowMessage, {
        message: `${target.name} already is in a party`,
        type: "info",
      });
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
          _id: target._id,
          class: target.class as CharacterClass,
          name: target.name,
        },
      ],
      maxSize: finalMaxSize,
      benefits,
    };

    try {
      const party = await CharacterParty.create(createParty);

      if (party) {
        await this.applyAllBuffInParty(party);
        const partyInfoData = party as unknown as ICharacterPartyShared;
        void this.sendMessageToPartyMembers(`${target.name} joined the party`, partyInfoData, true);
      }
      return party;
    } catch (error) {
      console.error(error);
    }
  }

  public inviteToParty(leader: ICharacter, target: ICharacter, character: ICharacter): void {
    if (!leader || !target) {
      throw new Error("Leader or target not found");
    }

    this.socketMessaging.sendEventToUser(target?.channelId!, PartySocketEvents.PartyInvite, {
      leaderId: leader._id,
      leaderName: leader.name,
    });
  }

  public async transferLeadership(leader: ICharacter, target: ICharacter, character: ICharacter): Promise<void> {
    const inSameParty = await this.checkIfSameParty(leader, target);

    if (!inSameParty) {
      this.socketMessaging.sendEventToUser<IUIShowMessage>(leader.channelId!, UISocketEvents.ShowMessage, {
        message: "The target character is not in your party",
        type: "info",
      });
      return;
    }

    const checkIfIsLeader = await this.checkIfIsLeader(character._id, leader._id);
    if (!checkIfIsLeader) {
      this.socketMessaging.sendEventToUser<IUIShowMessage>(leader.channelId!, UISocketEvents.ShowMessage, {
        message: "You are not the party leader",
        type: "info",
      });
      return;
    }

    const party = (await CharacterParty.findOne({ "leader._id": leader._id }).lean()) as ICharacterParty;
    if (!party) {
      throw new Error("Party not found");
    }

    const members = party.members.filter((member) => member._id.toString() !== target._id.toString());
    party.members = members;
    party.members.push({
      _id: leader._id,
      class: leader.class as CharacterClass,
      name: leader.name,
    });

    party.leader = {
      _id: target._id,
      class: target.class as CharacterClass,
      name: target.name,
    };

    const updatedParty = (await CharacterParty.findByIdAndUpdate(party._id, party, { new: true })) as ICharacterParty;

    const partyInfoData = updatedParty as unknown as ICharacterPartyShared;
    void this.sendMessageToPartyMembers("", partyInfoData, true);
  }

  public async leaveParty(leader: ICharacter, target: ICharacter, character: ICharacter): Promise<void> {
    const isLeader = await this.checkIfIsLeader(character._id, leader._id);
    const isSameAsTarget = target._id.toString() === character._id.toString();

    if (isLeader && isSameAsTarget) {
      const party = await this.getPartyByCharacterId(target._id);
      if (party && party.members!.length !== 0) {
        this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
          message: "You must transfer the leadership of the party before leaving!",
          type: "info",
        });
        return;
      }
    } else {
      if (!isSameAsTarget && !isLeader) {
        this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
          message: "You can't remove other members from the party",
          type: "info",
        });
        return;
      }
      if (isLeader && !(await this.checkIfSameParty(character, target))) {
        this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
          message: `The ${target.name} is not in the party`,
          type: "info",
        });
        return;
      }
    }

    await this.removeMemberFromParty(leader, target);
    if (isSameAsTarget) {
      await this.partyInfoRead(character);
    }
  }

  private async removeMemberFromParty(leader: ICharacter, target: ICharacter): Promise<void> {
    const party = await this.getPartyByCharacterId(leader._id);

    if (!party) {
      throw new Error("Party not found");
    }

    await this.removeAllBuffInParty(party);

    const members = party.members.filter((member) => member._id.toString() !== target._id.toString());
    party.members = members;

    const benefits = this.calculatePartyBenefits(party.size - 1, this.getDifferentClasses(party));
    party.benefits = benefits;

    if (party.members.length === 0) {
      const leaderData = (await Character.findById(leader._id).lean()) as ICharacter;
      await this.deleteParty(leaderData);
      await this.partyInfoRead(target);

      return;
    }

    const updatedParty = (await CharacterParty.findByIdAndUpdate(party._id, party, { new: true })) as ICharacterParty;
    await this.applyAllBuffInParty(updatedParty);

    await this.partyInfoRead(leader);
    await this.partyInfoRead(target);

    const partyInfoData = (await this.getPartyByCharacterId(leader._id)) as unknown as ICharacterPartyShared;
    void this.sendMessageToPartyMembers(`${target.name} left the party`, partyInfoData, true);
  }

  private async deleteParty(leader: ICharacter): Promise<void> {
    const isInParty = await this.checkIfIsInParty(leader);
    if (!isInParty) {
      this.socketMessaging.sendEventToUser<IUIShowMessage>(leader.channelId!, UISocketEvents.ShowMessage, {
        message: "You are not in a party",
        type: "info",
      });
      return;
    }

    const party = (await this.getPartyByCharacterId(leader._id)) as ICharacterParty;
    if (party && party !== null) {
      // await this.removeAllBuffInParty(party);
      await CharacterParty.deleteOne({ _id: party._id });
      await this.partyInfoRead(leader);
    }
  }

  public async getPartyByCharacterId(characterId: string): Promise<ICharacterParty | null> {
    const party = (await CharacterParty.findOne({
      $or: [{ "leader._id": characterId }, { "members._id": characterId }],
    }).lean({ virtuals: true })) as ICharacterParty;

    return party || null;
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

  private async sendMessageToPartyMembers(
    messageToSend: string,
    partyInfo?: ICharacterPartyShared,
    isToSendPartyData?: boolean | false
  ): Promise<void> {
    if (partyInfo && partyInfo.members) {
      for (let i = 0; i < partyInfo.members.length; i++) {
        const memberData = (await Character.findById(partyInfo.members[i]._id).lean()) as ICharacter;
        if (!memberData) continue;
        this.socketMessaging.sendEventToUser<IUIShowMessage>(memberData.channelId!, UISocketEvents.ShowMessage, {
          message: messageToSend,
          type: "info",
        });
        if (isToSendPartyData) {
          this.socketMessaging.sendEventToUser<ICharacterPartyShared>(
            memberData.channelId!,
            PartySocketEvents.PartyInfoOpen,
            partyInfo
          );
        }
      }

      // send to leader.
      const leaderData = (await Character.findById(partyInfo.leader._id).lean()) as ICharacter;
      if (leaderData) {
        this.socketMessaging.sendEventToUser<IUIShowMessage>(leaderData.channelId!, UISocketEvents.ShowMessage, {
          message: messageToSend,
          type: "info",
        });
        if (isToSendPartyData) {
          this.socketMessaging.sendEventToUser<ICharacterPartyShared>(
            leaderData.channelId!,
            PartySocketEvents.PartyInfoOpen,
            partyInfo
          );
        }
      }
    }
  }

  // #region Validations
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

  private async checkIfIsLeader(characterId: string, leaderId: string): Promise<boolean> {
    const party = (await CharacterParty.findOne({ "leader._id": characterId })) as ICharacterParty;
    if (!party || party === null) {
      return false;
    }

    return true;
  }

  private async checkIfSameParty(leader: ICharacter, target: ICharacter): Promise<boolean> {
    const leaderParty = await this.getPartyByCharacterId(leader._id);
    const targetParty = await this.getPartyByCharacterId(target._id);

    if (!leaderParty || !targetParty) {
      return false;
    }

    return leaderParty._id.toString() === targetParty._id.toString();
  }

  private async haveFreeSlots(leader: ICharacter): Promise<boolean> {
    const party = (await CharacterParty.findOne({ "leader._id": leader._id })
      .lean({ virtuals: true })
      .select("maxSize size members")) as ICharacterParty;

    if (!party) {
      return true;
    }

    const maxSize = party.maxSize;
    const actualSize = party.size;

    if (actualSize! >= maxSize) {
      return false;
    }

    return true;
  }

  public async isWithinRange(
    target: INPC,
    charactersId: Types.ObjectId[],
    maxDistance: number
  ): Promise<Types.ObjectId[]> {
    const charactersInRange: Types.ObjectId[] = [];
    const maxDistanceSquared = maxDistance * maxDistance;
    const characters = (await Character.find({
      _id: { $in: charactersId },
    })
      .lean()
      .select("_id scene x y")) as ICharacter[];
    if (!characters) {
      return [];
    }
    for (const character of characters) {
      if (target.scene !== character.scene) {
        continue;
      }
      const dx = target.x - character.x;
      const dy = target.y - character.y;
      const distanceSquared = dx * dx + dy * dy;
      if (distanceSquared <= maxDistanceSquared) {
        charactersInRange.push(character._id);
      }
    }
    return charactersInRange;
  }
  // #endregion
}
