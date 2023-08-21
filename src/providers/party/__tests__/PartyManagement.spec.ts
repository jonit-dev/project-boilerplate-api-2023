import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { CharacterClass, PartySocketEvents, UISocketEvents } from "@rpg-engine/shared";
import PartyManagement from "../PartyManagement";

describe("Party Management", () => {
  let partyManagement: PartyManagement;
  let characterLeader: ICharacter;
  let firstMember: ICharacter;
  let secondMember: ICharacter;
  let thirdMember: ICharacter;
  let messageSpy: jest.SpyInstance;

  beforeAll(() => {
    partyManagement = container.get<PartyManagement>(PartyManagement);

    // @ts-ignore
    messageSpy = jest.spyOn(partyManagement.socketMessaging, "sendEventToUser");
  });

  beforeEach(async () => {
    messageSpy.mockClear();

    characterLeader = await unitTestHelper.createMockCharacter(
      {
        class: CharacterClass.Rogue,
      },
      {
        hasEquipment: true,
        hasSkills: true,
        hasInventory: true,
      }
    );

    firstMember = await unitTestHelper.createMockCharacter(
      {
        class: CharacterClass.Berserker,
      },
      {
        hasEquipment: true,
        hasSkills: true,
        hasInventory: true,
      }
    );

    secondMember = await unitTestHelper.createMockCharacter(
      {
        class: CharacterClass.Hunter,
      },
      {
        hasEquipment: true,
        hasSkills: true,
        hasInventory: true,
      }
    );

    thirdMember = await unitTestHelper.createMockCharacter(
      { class: CharacterClass.Druid },
      {
        hasEquipment: true,
        hasSkills: true,
        hasInventory: true,
      }
    );
    await characterLeader.save();
    await firstMember.save();
    await secondMember.save();
    await thirdMember.save();
  });

  afterEach(() => {
    messageSpy.mockClear();
    messageSpy.mockClear();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it("should create a party", async () => {
    // @ts-ignore
    await partyManagement.createParty(characterLeader, firstMember);

    // @ts-ignore
    expect(await partyManagement.checkIfIsInParty(characterLeader)).toBeTruthy();
    // @ts-ignore
    expect(await partyManagement.checkIfIsInParty(firstMember)).toBeTruthy();
  });

  it("should create a party when leader is not in a party", async () => {
    // @ts-ignore
    const createPartySpy = jest.spyOn(partyManagement, "createParty");
    // @ts-ignore
    const checkIfIsInPartySpy = jest.spyOn(partyManagement, "checkIfIsInParty").mockResolvedValue(false);

    await partyManagement.acepptInvite(characterLeader, firstMember, firstMember);
    expect(createPartySpy).toHaveBeenCalledWith(characterLeader, firstMember);

    (createPartySpy as jest.SpyInstance).mockRestore();
    (checkIfIsInPartySpy as jest.SpyInstance).mockRestore();
  });

  it("should invite to party when leader is already in a party", async () => {
    // @ts-ignore
    const addMemberToPartySpy = jest.spyOn(partyManagement, "addMemberToParty");
    // @ts-ignore
    const checkIfIsInPartySpy = jest.spyOn(partyManagement, "checkIfIsInParty").mockResolvedValue(true);

    await partyManagement.acepptInvite(characterLeader, firstMember, characterLeader);
    expect(addMemberToPartySpy).toHaveBeenCalledWith(characterLeader, firstMember, characterLeader);

    (addMemberToPartySpy as jest.SpyInstance).mockRestore();
    (checkIfIsInPartySpy as jest.SpyInstance).mockRestore();
  });

  it("should check leader in party", async () => {
    // @ts-ignore
    await partyManagement.createParty(characterLeader, firstMember);

    // @ts-ignore
    expect(await partyManagement.checkIfIsLeader(characterLeader._id)).toBeTruthy();
    // @ts-ignore
    expect(await partyManagement.checkIfIsLeader(firstMember._id)).toBeFalsy();
  });

  it("should transfer leadership without removing the old leader", async () => {
    // @ts-ignore
    await partyManagement.createParty(characterLeader, firstMember);
    await partyManagement.transferLeadership(characterLeader, firstMember, characterLeader);

    // @ts-ignore
    expect(await partyManagement.checkIfIsLeader(characterLeader._id)).toBeFalsy();
    // @ts-ignore
    expect(await partyManagement.checkIfIsLeader(firstMember._id)).toBeTruthy();
    // @ts-ignore
    expect(await partyManagement.checkIfIsInParty(characterLeader)).toBeTruthy();
  });

  it("should transfer leadership and remove the old leader", async () => {
    // @ts-ignore
    await partyManagement.createParty(characterLeader, firstMember);
    await partyManagement.acepptInvite(characterLeader, secondMember, characterLeader);

    await partyManagement.transferLeadership(characterLeader, firstMember, characterLeader);

    await partyManagement.leaveParty(firstMember, characterLeader, firstMember);

    // @ts-ignore
    expect(await partyManagement.checkIfIsLeader(characterLeader._id)).toBeFalsy();
    // @ts-ignore
    expect(await partyManagement.checkIfIsLeader(firstMember._id)).toBeTruthy();

    // @ts-ignore
    expect(await partyManagement.checkIfIsInParty(characterLeader)).toBeFalsy();
    // @ts-ignore
    expect(await partyManagement.checkIfIsLeader(characterLeader._id)).toBeFalsy();
  });

  it("should a leader be able to invite a character to the party", async () => {
    // @ts-ignore
    jest.spyOn(partyManagement.socketMessaging, "sendEventToUser" as any);
    // @ts-ignore
    await partyManagement.createParty(characterLeader, firstMember);
    // @ts-ignore
    expect(await partyManagement.checkIfIsInParty(firstMember)).toBeTruthy();
    // @ts-ignore
    await partyManagement.inviteToParty(characterLeader, secondMember);

    // @ts-ignore
    expect(messageSpy).toHaveBeenCalledWith(secondMember.channelId!, PartySocketEvents.PartyInvite, {
      leaderId: characterLeader._id,
      leaderName: characterLeader.name,
    });
  });

  it("should check if two characters are in the same party", async () => {
    // @ts-ignore
    await partyManagement.createParty(characterLeader, firstMember);

    // @ts-ignore
    const areInSameParty = await partyManagement.checkIfSameParty(characterLeader, firstMember);

    expect(areInSameParty).toBeTruthy();
  });

  it("should check if two characters are not in the same party", async () => {
    // @ts-ignore
    await partyManagement.createParty(characterLeader, firstMember);
    // @ts-ignore
    await partyManagement.createParty(secondMember, thirdMember);

    // @ts-ignore
    const areInSameParty = await partyManagement.checkIfSameParty(characterLeader, thirdMember);

    expect(areInSameParty).toBeFalsy();
  });

  // LEAVE PARTY TESTS
  it("should allow a leader to remove a member", async () => {
    // @ts-ignore
    jest.spyOn(partyManagement.socketMessaging, "sendEventToUser" as any);

    // @ts-ignore
    await partyManagement.createParty(characterLeader, firstMember);
    await partyManagement.acepptInvite(characterLeader, secondMember, characterLeader);

    await partyManagement.leaveParty(characterLeader, firstMember, characterLeader);

    // @ts-ignore
    expect(await partyManagement.checkIfIsInParty(firstMember)).toBeFalsy();

    // @ts-ignore
    expect(messageSpy).toHaveBeenCalledWith(characterLeader.channelId!, UISocketEvents.ShowMessage, {
      message: `${firstMember.name} left the party`,
      type: "info",
    });
  });

  it("should not allow non-leader character to remove members", async () => {
    // @ts-ignore
    jest.spyOn(partyManagement.socketMessaging, "sendEventToUser" as any);

    // @ts-ignore
    await partyManagement.createParty(characterLeader, firstMember);
    await partyManagement.leaveParty(firstMember, characterLeader, firstMember);

    // @ts-ignore
    expect(messageSpy).toHaveBeenCalledWith(firstMember.channelId!, UISocketEvents.ShowMessage, {
      message: "You can't remove other members from the party",
      type: "info",
    });

    // expect(messageSpy).toBeCalledWith(firstMember, "You can't remove other members from the party");
  });

  it("should allow a leader to remove themselves and close party", async () => {
    // @ts-ignore
    await partyManagement.createParty(characterLeader, firstMember);
    await partyManagement.acepptInvite(characterLeader, secondMember, characterLeader);

    await partyManagement.leaveParty(characterLeader, secondMember, characterLeader);
    await partyManagement.leaveParty(characterLeader, firstMember, characterLeader);

    // @ts-ignore
    expect(await partyManagement.checkIfIsInParty(characterLeader)).toBeFalsy();
    // @ts-ignore
    expect(await partyManagement.checkIfIsInParty(firstMember)).toBeFalsy();
    // @ts-ignore
    expect(await partyManagement.checkIfIsInParty(secondMember)).toBeFalsy();
  });

  it("should not allow a leader to remove a character that's not in the party", async () => {
    // @ts-ignore
    await partyManagement.createParty(characterLeader, firstMember);
    await partyManagement.leaveParty(characterLeader, thirdMember, characterLeader);

    // @ts-ignore
    expect(messageSpy).toHaveBeenCalledWith(characterLeader.channelId!, UISocketEvents.ShowMessage, {
      message: `${thirdMember.name} is not in your party!`,
      type: "info",
    });
  });

  it("should allow a non-leader member to leave the party", async () => {
    // @ts-ignore
    await partyManagement.createParty(characterLeader, firstMember);
    await partyManagement.acepptInvite(characterLeader, secondMember, characterLeader);
    await partyManagement.leaveParty(characterLeader, firstMember, firstMember);

    // @ts-ignore
    expect(await partyManagement.checkIfIsInParty(firstMember)).toBeFalsy();
    // @ts-ignore
    expect(messageSpy).toHaveBeenCalledWith(firstMember.channelId!, UISocketEvents.ShowMessage, {
      message: `${firstMember.name} left the party`,
      type: "info",
    });
  });

  it("should not allow a non-leader member to remove other member", async () => {
    // @ts-ignore
    await partyManagement.createParty(characterLeader, firstMember);
    await partyManagement.acepptInvite(characterLeader, secondMember, characterLeader);

    await partyManagement.leaveParty(characterLeader, firstMember, secondMember);
    // @ts-ignore
    expect(messageSpy).toHaveBeenCalledWith(firstMember.channelId!, UISocketEvents.ShowMessage, {
      message: "You can't remove other members from the party",
      type: "info",
    });
  });
  // END LEAVE PARTY TESTS

  it("should return a party if the character is the leader", async () => {
    // @ts-ignore
    await partyManagement.createParty(characterLeader, firstMember);

    // @ts-ignore
    const party = await partyManagement.getPartyByCharacterId(characterLeader);

    expect(party).toBeDefined();
    expect(party?.leader._id).toEqual(characterLeader._id);
  });

  it("should return a party if the character is a member", async () => {
    // @ts-ignore
    await partyManagement.createParty(characterLeader, firstMember);

    // @ts-ignore
    const party = await partyManagement.getPartyByCharacterId(firstMember);

    expect(party).toBeDefined();
    expect(party?.members.some((member) => member._id.toString() === firstMember._id.toString())).toBeTruthy();
  });

  it("should return null if the character is not part of a party", async () => {
    // @ts-ignore
    await partyManagement.createParty(characterLeader, firstMember);

    // @ts-ignore
    const party = await partyManagement.getPartyByCharacterId(thirdMember);

    expect(party).toBeNull();
  });

  it("should not allow leader to transfer leadership to a character not in the same party", async () => {
    // @ts-ignore
    await partyManagement.createParty(characterLeader, firstMember);
    // @ts-ignore
    jest.spyOn(partyManagement, "checkIfSameParty").mockResolvedValue(false);

    await partyManagement.transferLeadership(characterLeader, secondMember, characterLeader);

    // @ts-ignore
    expect(messageSpy).toHaveBeenCalledWith(characterLeader.channelId!, UISocketEvents.ShowMessage, {
      message: `${secondMember.name} is not in your party!`,
      type: "info",
    });
  });

  it("should not allow to invite a character that's already in a party", async () => {
    // @ts-ignore
    await partyManagement.createParty(characterLeader, secondMember);
    // @ts-ignore
    await partyManagement.inviteToParty(characterLeader, secondMember, characterLeader);

    // @ts-ignore
    expect(messageSpy).toHaveBeenCalledWith(characterLeader.channelId!, UISocketEvents.ShowMessage, {
      message: `${secondMember.name} already is in a party`,
      type: "info",
    });
  });

  it("should not allow to invite a character when the party is full", async () => {
    // @ts-ignore
    await partyManagement.createParty(characterLeader, firstMember, 2);
    // @ts-ignore
    await partyManagement.inviteToParty(characterLeader, secondMember);

    // @ts-ignore
    expect(await partyManagement.checkIfIsInParty(secondMember)).toBeFalsy();
    // @ts-ignore
    expect(messageSpy).toHaveBeenCalledWith(characterLeader.channelId!, UISocketEvents.ShowMessage, {
      message: "The party is already full",
      type: "info",
    });
  });
});
