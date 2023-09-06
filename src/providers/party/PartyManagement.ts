import { CharacterBuff } from "@entities/ModuleCharacter/CharacterBuffModel";
import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { CharacterParty, ICharacterParty } from "@entities/ModuleCharacter/CharacterPartyModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { CharacterBuffActivator } from "@providers/character/characterBuff/CharacterBuffActivator";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import {
  BasicAttribute,
  CharacterAttributes,
  CharacterBuffDurationType,
  CharacterBuffType,
  CharacterClass,
  CharacterPartyBenefits,
  CharacterPartyDistributionBonus,
  CharacterPartyDropBonus,
  CharacterPartyEXPBonus,
  CharacterPartySkillBonus,
  CombatSkill,
  CraftingSkill,
  ICharacterBuff,
  ICharacterPartyShared,
  ICharacterPermanentBuff,
  IUIShowMessage,
  PartySocketEvents,
  UISocketEvents,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import _ from "lodash";
import { Types } from "mongoose";

type BuffSkillTypes = BasicAttribute | CombatSkill | CraftingSkill | CharacterAttributes;

@provide(PartyManagement)
export default class PartyManagement {
  constructor(private socketMessaging: SocketMessaging, private characterBuffActivator: CharacterBuffActivator) {}

  // PARTY MANAGEMENT
  public async inviteToParty(leader: ICharacter, target: ICharacter): Promise<void> {
    const isTargetInParty = await this.getPartyByCharacterId(target._id);
    if (isTargetInParty) {
      this.socketMessaging.sendEventToUser<IUIShowMessage>(leader.channelId!, UISocketEvents.ShowMessage, {
        message: `${target.name} already is in a party!`,
        type: "info",
      });
      return;
    }

    if (!(await this.checkIfPartyHaveFreeSlots(leader))) {
      this.socketMessaging.sendEventToUser<IUIShowMessage>(leader.channelId!, UISocketEvents.ShowMessage, {
        message: "The party is already full!",
        type: "info",
      });
      return;
    }

    this.socketMessaging.sendEventToUser(target?.channelId!, PartySocketEvents.PartyInvite, {
      leaderId: leader._id,
      leaderName: leader.name,
    });

    this.socketMessaging.sendEventToUser<IUIShowMessage>(leader.channelId!, UISocketEvents.ShowMessage, {
      message: `Send invite to ${target.name}!`,
      type: "info",
    });
  }

  public async acceptInvite(leader: ICharacter, target: ICharacter): Promise<ICharacterParty | undefined> {
    const isPartyExist = await this.getPartyByCharacterId(leader._id);

    const party: ICharacterParty | undefined = isPartyExist
      ? await this.addMemberToParty(leader, target)
      : await this.createParty(leader, target);

    if (!party) {
      throw new Error("Error accept invite Party!");
    }

    return party;
  }

  private async addMemberToParty(leader: ICharacter, target: ICharacter): Promise<ICharacterParty | undefined> {
    const targetIsInParty = await this.getPartyByCharacterId(target._id);
    if (targetIsInParty) {
      this.socketMessaging.sendEventToUser<IUIShowMessage>(leader.channelId!, UISocketEvents.ShowMessage, {
        message: `${target.name} already is in a party!`,
        type: "info",
      });

      return;
    }

    if (!(await this.checkIfPartyHaveFreeSlots(leader))) {
      this.socketMessaging.sendEventToUser<IUIShowMessage>(leader.channelId!, UISocketEvents.ShowMessage, {
        message: "The party is already full",
        type: "info",
      });

      return;
    }

    const party = (await this.getPartyByCharacterId(leader._id)) as ICharacterParty;
    let isAdding = false;
    await this.handleAllBuffInParty(party, isAdding);

    party.members.push({
      _id: target._id,
      class: target.class as CharacterClass,
      name: target.name,
    });

    const benefits = this.calculatePartyBenefits(party.size + 1, this.getDifferentClasses(party));

    const updatedParty = (await CharacterParty.findByIdAndUpdate(
      party._id,
      {
        members: party.members,
        benefits,
      },
      { new: true }
    )) as ICharacterParty;

    isAdding = true;
    await this.handleAllBuffInParty(updatedParty, isAdding);

    const message = `${target.name} joined the party!`;
    await this.sendMessageToAllMembers(message, updatedParty);

    return updatedParty;
  }

  private async createParty(
    leader: ICharacter,
    target: ICharacter,
    maxSize?: number
  ): Promise<ICharacterParty | undefined> {
    const targetIsInParty = await this.getPartyByCharacterId(target._id);
    if (targetIsInParty) {
      this.socketMessaging.sendEventToUser<IUIShowMessage>(leader.channelId!, UISocketEvents.ShowMessage, {
        message: `${target.name} already is in a party!`,
        type: "info",
      });

      return;
    }

    const finalMaxSize = typeof maxSize !== "undefined" ? Math.min(Math.max(maxSize, 2), 5) : 5;

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
        const isAdding = true;
        await this.handleAllBuffInParty(party, isAdding);
        const message = `${target.name} joined the party!`;
        await this.sendMessageToAllMembers(message, party);

        return party;
      }

      return;
    } catch (error) {
      console.error(error);
    }
  }

  public async transferLeadership(partyId: string, target: ICharacter, eventCaller: ICharacter): Promise<boolean> {
    const party = (await CharacterParty.findById(partyId).lean().select("_id leader members")) as ICharacterParty;

    if (!party) {
      return false;
    }

    const isLeader = this.checkIfIsLeader(party, eventCaller);

    if (!isLeader) {
      this.socketMessaging.sendEventToUser<IUIShowMessage>(eventCaller.channelId!, UISocketEvents.ShowMessage, {
        message: "You are not the party leader!",
        type: "info",
      });

      return false;
    }

    const inSameParty = this.areBothInSameParty(party, eventCaller, target);
    const isTargetSameParty = this.checkIfInParty(party, target);

    if (!isTargetSameParty || !inSameParty) {
      this.socketMessaging.sendEventToUser<IUIShowMessage>(eventCaller.channelId!, UISocketEvents.ShowMessage, {
        message: `${target.name} is not in your party!`,
        type: "info",
      });

      return false;
    }

    const members = party.members.filter((member) => member._id.toString() !== target._id.toString());

    party.members = members;
    party.members.push({
      _id: party.leader._id,
      class: party.leader.class as CharacterClass,
      name: party.leader.name,
    });

    party.leader = {
      _id: target._id,
      class: target.class as CharacterClass,
      name: target.name,
    };

    const updatedParty = (await CharacterParty.findByIdAndUpdate(party._id, party, { new: true })) as ICharacterParty;

    const message = `Leadership has been transferred to ${target.name}!`;
    await this.sendMessageToAllMembers(message, updatedParty);

    await this.partyPayloadSend(updatedParty);

    return true;
  }

  public async leaveParty(partyId: string, targetOfEvent: ICharacter, eventCaller: ICharacter): Promise<boolean> {
    const party = (await CharacterParty.findById(partyId).lean().select("_id leader members")) as ICharacterParty;

    const isLeader = this.checkIfIsLeader(party, eventCaller);
    const isSameAsTarget = this.checkIfIsSameTarget(targetOfEvent._id, eventCaller._id);
    const isTargetInParty = this.checkIfInParty(party, targetOfEvent);

    let infoMessage = "";

    if (isLeader && isSameAsTarget) {
      infoMessage = "You must transfer the leadership of the party before leaving!";
    } else if (!isTargetInParty) {
      infoMessage = `${targetOfEvent.name} is not in your party!`;
    } else if (!isLeader && !isSameAsTarget) {
      infoMessage = "You can't remove other members from the party!";
    }

    if (infoMessage) {
      this.socketMessaging.sendEventToUser<IUIShowMessage>(eventCaller.channelId!, UISocketEvents.ShowMessage, {
        message: infoMessage,
        type: "info",
      });

      return false;
    }
    return await this.removeMemberFromParty(party, targetOfEvent);
  }

  private async removeMemberFromParty(party: ICharacterParty, eventCaller: ICharacter): Promise<boolean> {
    if (!party) {
      return false;
    }

    let isAdding = false;
    await this.handleAllBuffInParty(party, isAdding);

    party.members = party.members.filter((member) => member._id.toString() !== eventCaller._id.toString());

    const partySize = party.size || party.members.length + 1;
    party.benefits = this.calculatePartyBenefits(partySize, this.getDifferentClasses(party));

    if (party.members.length === 0) {
      await this.deleteParty(eventCaller._id);
      const message = "Party Deleted!";
      await this.sendMessageToAllMembers(message, party);

      await this.partyPayloadSend(null, [eventCaller._id, party.leader._id]);

      return true;
    }

    const updatedParty = (await CharacterParty.findByIdAndUpdate(party._id, party, { new: true })) as ICharacterParty;

    isAdding = true;
    await this.handleAllBuffInParty(updatedParty, isAdding);

    const message = `${eventCaller.name} left the party!`;
    await this.sendMessageToAllMembers(message, updatedParty);

    await this.partyPayloadSend(updatedParty);
    await this.partyPayloadSend(null, [eventCaller._id]);

    return true;
  }

  private async deleteParty(character: ICharacter): Promise<void> {
    const party = (await this.getPartyByCharacterId(character._id)) as ICharacterParty;
    if (!party) {
      this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
        message: "You are not in a party",
        type: "info",
      });
      return;
    }

    await this.handleAllBuffInParty(party, false);
    await CharacterParty.deleteOne({ _id: party._id });
    const updatedParty = (await CharacterParty.findById(party._id)) as ICharacterParty;
    await this.partyPayloadSend(updatedParty);
  }

  public async getPartyByCharacterId(characterId: string): Promise<ICharacterParty | null> {
    const party = (await CharacterParty.findOne({
      $or: [
        {
          "leader._id": characterId,
        },
        {
          "members._id": characterId,
        },
      ],
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

  // CHARACTERS BUFFS
  public async handleAllBuffInParty(teste: ICharacterParty, isAdding: boolean): Promise<void> {
    const party = (await CharacterParty.findById(teste._id)
      .lean()
      .select("_id leader members size")) as ICharacterParty;

    const differentClasses = this.getDifferentClasses(party);
    const { leader, members, size } = party;

    const numberOfMembers = size || members.length + 1;
    const benefits = this.calculatePartyBenefits(numberOfMembers, differentClasses);

    const skillBenefit = benefits.find((benefit) => benefit.benefit === CharacterPartyBenefits.Skill);

    if (!skillBenefit) {
      return;
    }

    try {
      await this.handleCharacterBuffSkill(leader._id.toString(), skillBenefit.value, isAdding);
      for (const member of members) {
        await this.handleCharacterBuffSkill(member._id.toString(), skillBenefit.value, isAdding);
      }
    } catch (error) {
      console.error(`Error ${isAdding ? "applying" : "removing"} buff from party:`, error);
    }
  }

  private async handleCharacterBuffSkill(
    characterId: string,
    buffPercentage: number,
    isAdding: boolean = true
  ): Promise<void> {
    try {
      const character = (await Character.findById(characterId)
        .lean()
        .select("_id class channelId skills")) as ICharacter;

      const traits = this.getClassTraits(character.class as CharacterClass);
      const tasks = isAdding
        ? [this.applyCharacterBuff(character, traits, buffPercentage)]
        : [this.removeCharacterBuff(character, traits, buffPercentage)];

      await Promise.all(tasks);
    } catch (error) {
      console.error(`Error ${isAdding ? "applying" : "removing"} buff to character:`, error);
    }
  }

  private async removeCharacterBuff(character: ICharacter, traits: string[], buffPercentage: number): Promise<void> {
    for await (const trait of traits) {
      const buff = (await CharacterBuff.findOne({
        owner: character._id,
        trait,
        buffPercentage,
        durationType: CharacterBuffDurationType.Permanent,
      })
        .lean()
        .select("_id")) as ICharacterBuff;

      if (!buff) {
        return;
      }
      await this.characterBuffActivator.disableBuff(character, buff._id!, CharacterBuffType.Skill, true);
    }
  }

  private async applyCharacterBuff(character: ICharacter, traits: string[], buffPercentage: number): Promise<void> {
    const capitalizedTraits = traits.map((trait) => {
      if (trait === BasicAttribute.MagicResistance) {
        return "Magic Resistance";
      }

      return _.capitalize(trait);
    });

    const activationMessage = `Aura of ${capitalizedTraits.join(
      ", "
    )} boosts your skills by ${buffPercentage}% respectively.`;
    const deactivationMessage = `Aura of ${capitalizedTraits.join(
      ", "
    )} fades, reducing your skills by ${buffPercentage}% respectively.`;

    for await (const trait of traits) {
      const buff = {
        type: CharacterBuffType.Skill,
        trait,
        buffPercentage,
        durationType: CharacterBuffDurationType.Permanent,
        skipAllMessages: false,
        skipDeactivationMessage: false,
        options: {
          messages: {
            activation: activationMessage,
            deactivation: deactivationMessage,
          },
        },
      } as ICharacterPermanentBuff;

      await this.characterBuffActivator.enablePermanentBuff(character, buff, true);
    }
  }

  // SEND MESSAGE OR DATA
  public async partyPayloadSend(party: ICharacterParty | null, charactersId?: Types.ObjectId[]): Promise<void> {
    const allCharactersId = new Set<Types.ObjectId>(charactersId ? [...charactersId] : []);

    let partyPayload: ICharacterPartyShared | undefined;

    if (party) {
      allCharactersId.add(party.leader._id);
      party.members.forEach((member) => allCharactersId.add(member._id));
      partyPayload = this.generateDataPayloadFromServer(party);
    }

    const fetchCharacter = async (id: Types.ObjectId): Promise<ICharacter> => {
      return (await Character.findById(id.toString()).lean().select("channelId")) as ICharacter;
    };

    const sendPayloadToCharacter = async (characterId: Types.ObjectId): Promise<void> => {
      const character = await fetchCharacter(characterId);
      this.socketMessaging.sendEventToUser<ICharacterPartyShared>(
        character.channelId!,
        PartySocketEvents.PartyInfoOpen,
        partyPayload
      );
    };

    if (allCharactersId.size === 1 && !partyPayload) {
      return sendPayloadToCharacter(allCharactersId.values().next().value);
    }

    await Promise.all(Array.from(allCharactersId).map(sendPayloadToCharacter));
  }

  private async sendMessageToAllMembers(message: string, party: ICharacterParty): Promise<void> {
    if (!party.members || !party.leader) {
      throw new Error("Empty party to send Message or Data!");
    }

    const charactersIds = new Set<Types.ObjectId>();
    charactersIds.add(party.leader._id);

    for (const member of party.members) {
      charactersIds.add(member._id);
    }

    for (const characterId of charactersIds) {
      const character = (await Character.findById(characterId).lean().select("channelId")) as ICharacter;

      this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
        message,
        type: "info",
      });
    }
  }

  // PARTY VALIDATIONS
  private checkIfIsLeader(party: ICharacterParty, eventCaller: ICharacter): boolean {
    if (!party) {
      return false;
    }

    return party.leader._id.toString() === eventCaller._id.toString();
  }

  private checkIfIsSameTarget(targetOfEventId: string, eventCallerId: string): boolean {
    if (!targetOfEventId || !eventCallerId) {
      return false;
    }

    return eventCallerId.toString() === targetOfEventId.toString();
  }

  private checkIfInParty(party: ICharacterParty, eventCaller: ICharacter): boolean {
    if (!party) {
      return false;
    }

    const isMember = party.members.some((member) => member._id.toString() === eventCaller._id.toString());

    const isLeader = party.leader._id.toString() === eventCaller._id.toString();

    return isMember || isLeader;
  }

  private areBothInSameParty(party: ICharacterParty, eventCaller: ICharacter, target: ICharacter): boolean {
    if (!party) {
      return false;
    }

    const isEventCallerInParty =
      party.members.some((member) => member._id.toString() === eventCaller._id.toString()) ||
      party.leader._id.toString() === eventCaller._id.toString();

    const isTargetInParty =
      party.members.some((member) => member._id.toString() === target._id.toString()) ||
      party.leader._id.toString() === target._id.toString();

    return isEventCallerInParty && isTargetInParty;
  }

  private async checkIfPartyHaveFreeSlots(character: ICharacter): Promise<boolean> {
    const party = (await CharacterParty.findOne({ "leader._id": character._id })
      .lean({ virtuals: true, defaults: true })
      .select("maxSize size members")) as ICharacterParty;

    if (!party) {
      return true;
    }

    const maxSize = party.maxSize;
    const actualSize = party.size;

    if (actualSize >= maxSize) {
      return false;
    }

    return true;
  }

  public async isWithinRange(
    target: INPC,
    charactersId: Types.ObjectId[],
    maxDistance: number
  ): Promise<Set<Types.ObjectId>> {
    const charactersInRange = new Set<Types.ObjectId>();
    const maxDistanceSquared = maxDistance * maxDistance;
    const characters = (await Character.find({
      _id: { $in: charactersId },
    })
      .lean()
      .select("_id scene x y isAlive isOnline")) as ICharacter[];

    if (!characters) {
      return charactersInRange;
    }

    for (const character of characters) {
      if (
        target.scene !== character.scene ||
        character.isAlive === false ||
        character.health === 0 ||
        character.isOnline === false
      ) {
        continue;
      }

      const dx = target.x - character.x;
      const dy = target.y - character.y;
      const distanceSquared = dx * dx + dy * dy;

      if (distanceSquared <= maxDistanceSquared) {
        charactersInRange.add(character._id);
      }
    }

    return charactersInRange;
  }

  // HELP FUNCTIONS
  public generateDataPayloadFromServer(party: ICharacterParty): ICharacterPartyShared | undefined {
    const convertedParty: ICharacterPartyShared = {
      id: party._id ? party._id.toString() : undefined,
      leader: {
        _id: party.leader._id.toString(),
        class: party.leader.class as CharacterClass,
        name: party.leader.name,
      },
      members: party.members.map((member) => ({
        _id: member._id.toString(),
        class: member.class as CharacterClass,
        name: member.name,
      })),
      maxSize: party.maxSize,
      size: party.size,
      benefits: party.benefits
        ? party.benefits.map((benefit) => ({
            benefit: benefit.benefit as CharacterPartyBenefits,
            value: benefit.value,
          }))
        : undefined,
    };

    return convertedParty || undefined;
  }

  private getClassTraits(charClass: CharacterClass): BuffSkillTypes[] {
    const classTraits: Record<CharacterClass, BuffSkillTypes[]> = {
      None: [BasicAttribute.Strength, BasicAttribute.Resistance],
      Warrior: [BasicAttribute.Strength, BasicAttribute.Resistance],
      Berserker: [BasicAttribute.Strength, BasicAttribute.Resistance],
      Druid: [BasicAttribute.Magic, BasicAttribute.Resistance],
      Sorcerer: [BasicAttribute.Magic, BasicAttribute.MagicResistance],
      Rogue: [BasicAttribute.Dexterity, CombatSkill.Dagger],
      Hunter: [BasicAttribute.Dexterity, CombatSkill.Distance],
    };

    return classTraits[charClass] || [BasicAttribute.Strength, BasicAttribute.Resistance];
  }

  // SERVER BOOTSTRAP
  public async clearAllParties(): Promise<void> {
    const allPartys = (await CharacterParty.find({}).lean()) as ICharacterParty[];

    const removeTasks = allPartys.map(async (party) => {
      try {
        await this.handleAllBuffInParty(party, false);
        await CharacterParty.findByIdAndDelete(party._id);
      } catch (error) {
        console.log("Error removing party buffs", error);
      }
    });

    await Promise.all(removeTasks);
  }
}
