import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { CharacterParty, ICharacterParty } from "@entities/ModuleCharacter/CharacterPartyModel";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { CharacterClass } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import _ from "lodash";
import mongoose, { Types } from "mongoose";

export interface ICharacterPartyShared {
  id?: string;
  leader: {
    _id: Types.ObjectId;
    class: CharacterClass;
  };
  members: {
    _id: Types.ObjectId;
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

export const calculatePartyBenefits = (
  numberOfMembers: number,
  differentClasses: number
): { benefit: CharacterPartyBenefits; value: number }[] => {
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
};

@provide(PartyManagement)
export default class PartyManagement {
  constructor(private socketMessaging: SocketMessaging) {}

  // create party
  async createParty(leader: ICharacter, target: ICharacter, maxSize?: number): Promise<void> {
    if (!leader) {
      throw new Error("Character not found");
    }

    if (!target) {
      this.socketMessaging.sendErrorMessageToCharacter(leader, "Target not found");

      return;
    }

    const isInParty = await this.checkIfIsInParty(leader);

    if (isInParty) {
      this.socketMessaging.sendErrorMessageToCharacter(leader, "You are already in a party");

      return;
    }

    const targetIsInParty = await this.checkIfIsInParty(target);

    if (targetIsInParty) {
      this.socketMessaging.sendErrorMessageToCharacter(leader, "Target are already in a party");

      return;
    }

    let finalMaxSize = 5;

    if (typeof maxSize !== "undefined") {
      finalMaxSize = maxSize < 2 ? 2 : maxSize > 5 ? 5 : maxSize;
    }

    const createParty: ICharacterPartyShared = {
      leader: {
        _id: mongoose.Types.ObjectId(leader._id),
        class: leader.class as CharacterClass,
      },
      members: [
        {
          _id: target._id,
          class: target.class as CharacterClass,
        },
      ],
      maxSize: finalMaxSize,
    };
    try {
      await CharacterParty.create(createParty).then((party) => {
        return party;
      });
    } catch (error) {
      console.log(error);
    }
  }

  // invte to a party
  async inviteToParty(leader: ICharacter, target: ICharacter): Promise<void> {
    if (!leader || !target) {
      throw new Error("Leader or target not found");
    }

    const party = (await CharacterParty.findOne({ "leader._id": leader._id }).lean()) as ICharacterParty;

    if (!party) {
      this.socketMessaging.sendErrorMessageToCharacter(leader, "You are not a party leader");
      return;
    }

    if (!(await this.haveFreeSlots(leader))) {
      this.socketMessaging.sendErrorMessageToCharacter(leader, "Your party is already full");
      return;
    }

    const targetIsInParty = await this.checkIfIsInParty(target);

    if (targetIsInParty) {
      this.socketMessaging.sendErrorMessageToCharacter(leader, "Target is already in a party");
      return;
    }

    party.members.push({
      _id: target._id,
      class: target.class as CharacterClass,
    });

    await CharacterParty.findByIdAndUpdate(party._id, {
      leader: {
        _id: leader._id,
        class: leader.class as CharacterClass,
      },
      members: party.members,
    });

    this.socketMessaging.sendMessageToCharacter(leader, `You invited ${target.name} to your party`);
    this.socketMessaging.sendMessageToCharacter(target, `${leader.name} invited you to their party`);
  }

  // check if is already in a party
  async checkIfIsInParty(character: ICharacter): Promise<boolean> {
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
  async checkIfIsLeader(character: ICharacter): Promise<boolean> {
    const party = (await CharacterParty.findOne({ "leader._id": character._id })
      .lean()
      .select("leader")) as ICharacterParty;

    if (!party || party === null) {
      return false;
    }

    return party.leader._id.toString() === character._id.toString();
  }

  private async removeMemberFromParty(leaderId: Types.ObjectId, memberId: Types.ObjectId): Promise<void> {
    const party = await this.findPartyByCharacterId(leaderId);

    if (!party) {
      throw new Error("Party not found");
    }

    const members = party.members.filter((member) => member._id.toString() !== memberId.toString());

    await CharacterParty.updateOne({ _id: party._id }, { $set: { members: members } });
  }

  async leaveParty(leader: ICharacter, target: ICharacter): Promise<void> {
    const isLeader = await this.checkIfIsLeader(leader);
    const isSameCharacter = leader._id.toString() === target._id.toString();

    if (isSameCharacter) {
      if (isLeader) {
        await this.deleteParty(leader);
        this.socketMessaging.sendMessageToCharacter(target, "You left the party");
      } else {
        await this.removeMemberFromParty(leader._id, leader._id);
        this.socketMessaging.sendMessageToCharacter(leader, "You left the party");
      }
    } else {
      if (isLeader) {
        if (!(await this.checkIfSameParty(leader, target))) {
          this.socketMessaging.sendErrorMessageToCharacter(leader, "The target character is not in your party");
        } else {
          await this.removeMemberFromParty(leader._id, target._id);
          this.socketMessaging.sendMessageToCharacter(leader, `You removed ${target.name} from the party`);
          this.socketMessaging.sendMessageToCharacter(target, "You left the party");
        }
      } else {
        this.socketMessaging.sendErrorMessageToCharacter(leader, "You can't remove other members from the party");
      }
    }
  }

  private async checkIfSameParty(leader: ICharacter, target: ICharacter): Promise<boolean> {
    const party = await CharacterParty.findOne({
      "leader._id": leader._id,
      "members._id": target._id,
    });

    return !!party;
  }

  private async deleteParty(leader: ICharacter): Promise<void> {
    const isInParty = await this.checkIfIsInParty(leader);

    if (!isInParty) {
      this.socketMessaging.sendErrorMessageToCharacter(leader, "You are not in a party");
      return;
    }

    const isLeader = await this.checkIfIsLeader(leader);

    if (!isLeader) {
      this.socketMessaging.sendErrorMessageToCharacter(leader, "You are not the party leader");
      return;
    }

    await CharacterParty.deleteOne({ "leader._id": leader._id });

    this.socketMessaging.sendMessageToCharacter(leader, "You have deleted the party");
  }

  // check actual free slots
  private async haveFreeSlots(leader: ICharacter): Promise<boolean> {
    const party = (await CharacterParty.findOne({ "leader._id": leader._id }).lean({
      virtuals: true,
    })) as ICharacterParty;

    if (!party) {
      return false;
    }

    const maxSize = party.maxSize;
    const actualSize = party.size;

    if (actualSize >= maxSize) {
      return false;
    }

    return true;
  }

  private async findPartyByCharacterId(characterId: Types.ObjectId): Promise<ICharacterParty | null> {
    const party = (await CharacterParty.findOne({
      $or: [{ "leader._id": characterId }, { "members._id": characterId }],
    }).lean({ virtuals: true })) as ICharacterParty;

    return party || null;
  }

  // transfer party leadership
  async transferLeadership(leader: ICharacter, target: ICharacter, removeLeader: boolean): Promise<void> {
    const inSameParty = await this.checkIfSameParty(leader, target);

    if (!inSameParty) {
      throw new Error("Leader and target are not in the same party");
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
    } else {
      party.members.push({
        _id: leader._id,
        class: leader.class as CharacterClass,
      });
    }

    await CharacterParty.findByIdAndUpdate(party._id, party);
  }
}
