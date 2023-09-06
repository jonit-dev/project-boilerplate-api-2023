import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { CharacterClass, PartySocketEvents, UISocketEvents } from "@rpg-engine/shared";
import PartyManagement from "../PartyManagement";
import { CharacterParty, ICharacterParty } from "@entities/ModuleCharacter/CharacterPartyModel";

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
    characterLeader = await unitTestHelper.createMockCharacter(
      {
        class: CharacterClass.Rogue,
        name: "Character Leader",
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
        name: "First Member",
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
        name: "Second Member",
      },
      {
        hasEquipment: true,
        hasSkills: true,
        hasInventory: true,
      }
    );

    thirdMember = await unitTestHelper.createMockCharacter(
      {
        class: CharacterClass.Druid,
        name: "Third Member",
      },
      {
        hasEquipment: true,
        hasSkills: true,
        hasInventory: true,
      }
    );
  });

  afterEach(() => {
    messageSpy.mockClear();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it("should create a party", async () => {
    const party = await partyManagement.acceptInvite(characterLeader, firstMember);

    expect(party).toBeDefined;

    // @ts-ignore
    expect(partyManagement.checkIfInParty(party, characterLeader)).toBeTruthy();
    // @ts-ignore
    expect(partyManagement.checkIfInParty(party, firstMember)).toBeTruthy();
  });

  it("should create a party when leader is not in a party", async () => {
    // @ts-ignore
    const createPartySpy = jest.spyOn(partyManagement, "createParty");
    // @ts-ignore
    const checkIfInPartySpy = jest.spyOn(partyManagement, "checkIfInParty").mockResolvedValue(false);

    await partyManagement.acceptInvite(characterLeader, firstMember);
    expect(createPartySpy).toHaveBeenCalledWith(characterLeader, firstMember);

    (createPartySpy as jest.SpyInstance).mockRestore();
    (checkIfInPartySpy as jest.SpyInstance).mockRestore();
  });

  it("should invite to party when leader is already in a party", async () => {
    // @ts-ignore
    const addMemberToPartySpy = jest.spyOn(partyManagement, "addMemberToParty");

    const party = await partyManagement.acceptInvite(characterLeader, firstMember);

    await partyManagement.acceptInvite(characterLeader, secondMember);

    expect(addMemberToPartySpy).toHaveBeenCalledWith(characterLeader, secondMember);

    // @ts-ignore
    expect(partyManagement.checkIfInParty(party, characterLeader)).toBeTruthy();
  });

  it("should check leader in party", async () => {
    const party = await partyManagement.acceptInvite(characterLeader, firstMember);

    expect(party).toBeDefined;

    // @ts-ignore
    expect(partyManagement.checkIfIsLeader(party, characterLeader)).toBeTruthy();
    // @ts-ignore
    expect(partyManagement.checkIfIsLeader(party, firstMember)).toBeFalsy();
  });

  it("should transfer leadership without removing the old leader", async () => {
    const party = await partyManagement.acceptInvite(characterLeader, firstMember);

    expect(party).toBeDefined;

    const success = await partyManagement.transferLeadership(party?._id, firstMember, characterLeader);

    expect(success).toBeTruthy;

    const updatedParty = (await CharacterParty.findById(party?._id).lean()) as ICharacterParty;

    // @ts-ignore
    expect(partyManagement.checkIfIsLeader(updatedParty, characterLeader)).toBeFalsy();
    // @ts-ignore
    expect(partyManagement.checkIfIsLeader(updatedParty, firstMember)).toBeTruthy();
    // @ts-ignore
    expect(partyManagement.checkIfInParty(updatedParty, characterLeader)).toBeTruthy();
  });

  it("should transfer leadership and remove the old leader", async () => {
    await partyManagement.acceptInvite(characterLeader, firstMember);
    const party = await partyManagement.acceptInvite(characterLeader, secondMember);

    expect(party).toBeDefined;

    let success = await partyManagement.transferLeadership(party?._id, firstMember, characterLeader);

    expect(success).toBeTruthy;

    success = await partyManagement.leaveParty(party?._id, characterLeader, firstMember);
    expect(success).toBeTruthy;

    const updatedParty = (await CharacterParty.findById(party?._id).lean()) as ICharacterParty;

    // @ts-ignore
    expect(partyManagement.checkIfIsLeader(updatedParty, characterLeader)).toBeFalsy();
    // @ts-ignore
    expect(partyManagement.checkIfIsLeader(updatedParty, firstMember)).toBeTruthy();

    // @ts-ignore
    expect(partyManagement.checkIfInParty(updatedParty, characterLeader)).toBeFalsy();
    // @ts-ignore
    expect(partyManagement.checkIfIsLeader(updatedParty, characterLeader)).toBeFalsy();
  });

  it("should a leader be able to invite a character to the party", async () => {
    // @ts-ignore
    jest.spyOn(partyManagement.socketMessaging, "sendEventToUser" as any);

    const party = await partyManagement.acceptInvite(characterLeader, firstMember);

    expect(party).toBeDefined;

    // @ts-ignore
    expect(partyManagement.checkIfInParty(party, firstMember)).toBeTruthy();
    // @ts-ignore
    await partyManagement.inviteToParty(characterLeader, secondMember);

    expect(messageSpy).toHaveBeenCalledWith(secondMember.channelId!, PartySocketEvents.PartyInvite, {
      leaderId: characterLeader._id,
      leaderName: characterLeader.name,
    });
  });

  it("should check if two characters are in the same party", async () => {
    await partyManagement.acceptInvite(characterLeader, firstMember);
    const party = await partyManagement.acceptInvite(characterLeader, thirdMember);

    // @ts-ignore
    const areInSameParty = partyManagement.areBothInSameParty(party, characterLeader, thirdMember);

    expect(areInSameParty).toBeTruthy();
  });

  it("should check if two characters are not in the same party", async () => {
    await partyManagement.acceptInvite(characterLeader, firstMember);
    const party = await partyManagement.acceptInvite(secondMember, thirdMember);

    // @ts-ignore
    const areInSameParty = partyManagement.areBothInSameParty(party, characterLeader, thirdMember);

    expect(areInSameParty).toBeFalsy();
  });

  // LEAVE PARTY TESTS
  it("should allow a leader to remove a member", async () => {
    // @ts-ignore
    jest.spyOn(partyManagement.socketMessaging, "sendEventToUser" as any);

    await partyManagement.acceptInvite(characterLeader, firstMember);
    const party = await partyManagement.acceptInvite(characterLeader, secondMember);

    expect(party).toBeDefined;

    const success = await partyManagement.leaveParty(party?._id, firstMember, characterLeader);

    expect(success).toBeTruthy;

    const updatedParty = (await CharacterParty.findById(party?._id).lean().select("leader members")) as ICharacterParty;

    // @ts-ignore
    expect(partyManagement.checkIfInParty(updatedParty, firstMember)).toBeFalsy();

    const nthCallArguments = messageSpy.mock.calls[5];
    const actualMessageObject = nthCallArguments[2];

    expect(actualMessageObject).toEqual({
      message: `${firstMember.name} left the party!`,
      type: "info",
    });
  });

  it("should not allow a leader to remove themselves", async () => {
    // @ts-ignore
    jest.spyOn(partyManagement.socketMessaging, "sendEventToUser" as any);

    const party = await partyManagement.acceptInvite(characterLeader, firstMember);

    expect(party).toBeDefined;

    await partyManagement.leaveParty(party?._id, characterLeader, characterLeader);

    expect(messageSpy).toHaveBeenCalledWith(firstMember.channelId!, UISocketEvents.ShowMessage, {
      message: "You must transfer the leadership of the party before leaving!",
      type: "info",
    });
  });

  it("should allow a leader to remove themselves and close party", async () => {
    const party = await partyManagement.acceptInvite(characterLeader, firstMember);

    expect(party).toBeDefined;

    await partyManagement.transferLeadership(party?._id, firstMember, characterLeader);

    expect(messageSpy).toHaveBeenCalledWith(firstMember.channelId!, UISocketEvents.ShowMessage, {
      message: "Leadership has been transferred to First Member!",
      type: "info",
    });
  });

  it("should not allow a leader to remove a character that's not in the party", async () => {
    const party = await partyManagement.acceptInvite(characterLeader, firstMember);

    expect(party).toBeDefined;

    await partyManagement.leaveParty(party?._id, characterLeader, thirdMember);

    expect(messageSpy).toHaveBeenCalledWith(characterLeader.channelId!, UISocketEvents.ShowMessage, {
      message: "You can't remove other members from the party!",
      type: "info",
    });
  });

  it("should allow a non-leader member to leave the party", async () => {
    // @ts-ignore
    await partyManagement.createParty(characterLeader, firstMember);
    const party = await partyManagement.acceptInvite(characterLeader, secondMember);

    expect(party).toBeDefined;

    const success = await partyManagement.leaveParty(party?._id, firstMember, firstMember);

    expect(success).toBeTruthy;

    const updatedParty = (await CharacterParty.findById(party?._id).lean().select("leader members")) as ICharacterParty;

    // @ts-ignore
    expect(partyManagement.checkIfInParty(updatedParty, firstMember)).toBeFalsy();

    const nthCallArguments = messageSpy.mock.calls[5];
    const actualMessageObject = nthCallArguments[2];

    expect(actualMessageObject).toEqual({
      message: `${firstMember.name} left the party!`,
      type: "info",
    });
  });

  it("should not allow a non-leader member to remove other member", async () => {
    // @ts-ignore
    await partyManagement.createParty(characterLeader, firstMember);
    const party = await partyManagement.acceptInvite(characterLeader, secondMember);

    expect(party).toBeDefined;

    await partyManagement.leaveParty(party?._id, characterLeader, firstMember);
    // @ts-ignore
    expect(messageSpy).toHaveBeenCalledWith(firstMember.channelId!, UISocketEvents.ShowMessage, {
      message: "You can't remove other members from the party!",
      type: "info",
    });
  });
  // END LEAVE PARTY TESTS

  it("should return a party if the character is the leader", async () => {
    // @ts-ignore
    await partyManagement.createParty(characterLeader, firstMember);

    const party = await partyManagement.getPartyByCharacterId(characterLeader._id);

    expect(party).toBeDefined();
    expect(party?.leader._id).toEqual(characterLeader._id);
  });

  it("should return a party if the character is a member", async () => {
    // @ts-ignore
    await partyManagement.acceptInvite(characterLeader, firstMember);

    const party = await partyManagement.getPartyByCharacterId(firstMember._id);

    expect(party).toBeDefined();
    expect(party?.members.some((member) => member._id.toString() === firstMember._id.toString())).toBeTruthy();
  });

  it("should return null if the character is not part of a party", async () => {
    // @ts-ignore
    const anotherParty = await partyManagement.getPartyByCharacterId(thirdMember._id);

    expect(anotherParty).toBeNull();
  });

  it("should not allow leader to transfer leadership to a character not in the same party", async () => {
    const party = await partyManagement.acceptInvite(characterLeader, firstMember);

    // @ts-ignore
    jest.spyOn(partyManagement, "checkIfInParty").mockResolvedValue(false);

    expect(party).toBeDefined;

    const success = await partyManagement.transferLeadership(party?._id, secondMember, characterLeader);

    expect(success).toBeTruthy;

    // @ts-ignore
    expect(messageSpy).toHaveBeenCalledWith(secondMember.channelId!, UISocketEvents.ShowMessage, {
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
      message: `${secondMember.name} already is in a party!`,
      type: "info",
    });
  });

  it("should not allow to invite a character when the party is full", async () => {
    // @ts-ignore
    const party = await partyManagement.createParty(characterLeader, firstMember, 2);

    expect(party).toBeDefined;

    // @ts-ignore
    await partyManagement.inviteToParty(characterLeader, secondMember);

    // @ts-ignore
    expect(partyManagement.areBothInSameParty(party, characterLeader, secondMember)).toBeFalsy();

    expect(messageSpy).toHaveBeenCalledWith(characterLeader.channelId!, UISocketEvents.ShowMessage, {
      message: "The party is already full!",
      type: "info",
    });
  });
});
