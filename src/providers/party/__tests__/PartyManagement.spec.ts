import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { CharacterClass, PartySocketEvents, UISocketEvents } from "@rpg-engine/shared";
import PartyManagement from "../PartyManagement";
import { CharacterParty, ICharacterParty } from "@entities/ModuleCharacter/CharacterPartyModel";
import { PartyNetworkInviteToParty } from "../network/PartyNetworkInviteToParty";

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
    messageSpy = jest.spyOn(partyManagement.socketMessaging, "sendErrorMessageToCharacter");
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
    expect(partyManagement.socketMessaging.sendEventToUser).toHaveBeenCalledWith(
      secondMember.channelId!,
      PartySocketEvents.PartyInvite,
      {
        leaderId: characterLeader._id,
        leaderName: characterLeader.name,
      }
    );
  });

  /*
  it("should send success messages when a character is successfully invited", async () => {
    // @ts-ignore
    await partyManagement.createParty(characterLeader, firstMember);
    // @ts-ignore
    await partyManagement.inviteToParty(characterLeader, secondMember);

    expect(messageSpy).toBeCalledWith(characterLeader, `You invited ${secondMember.name} to your party`);

    expect(messageSpy).toBeCalledWith(secondMember, `${characterLeader.name} invited you to their party`);
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
 */
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
    expect(partyManagement.socketMessaging.sendEventToUser).toHaveBeenCalledWith(
      characterLeader.channelId!,
      UISocketEvents.ShowMessage,
      {
        message: `${firstMember.name} left the party`,
        type: "info",
      }
    );
  });

  it("should not allow non-leader character to remove members", async () => {
    // @ts-ignore
    jest.spyOn(partyManagement.socketMessaging, "sendEventToUser" as any);

    // @ts-ignore
    await partyManagement.createParty(characterLeader, firstMember);
    await partyManagement.leaveParty(firstMember, characterLeader, firstMember);

    // @ts-ignore
    expect(partyManagement.socketMessaging.sendEventToUser).toHaveBeenCalledWith(
      firstMember.channelId!,
      UISocketEvents.ShowMessage,
      {
        message: "You can't remove other members from the party",
        type: "info",
      }
    );

    // expect(messageSpy).toBeCalledWith(firstMember, "You can't remove other members from the party");
  });

  /*
  it("should allow a leader to remove themselves and close party", async () => {
    // @ts-ignore
    await partyManagement.createParty(characterLeader, firstMember);
    await partyManagement.leaveParty(characterLeader, characterLeader);

    // @ts-ignore
    expect(await partyManagement.checkIfIsInParty(characterLeader)).toBeFalsy();
    // @ts-ignore
    expect(await partyManagement.checkIfIsInParty(firstMember)).toBeFalsy();
  });
  */

  /*
  it("should not allow a leader to remove a character that's not in the party", async () => {
    // @ts-ignore
    await partyManagement.createParty(characterLeader, firstMember);

    await partyManagement.leaveParty(characterLeader, thirdMember, characterLeader);

    expect(messageSpy).toBeCalledWith(characterLeader, "The target character is not in your party");
  });

  it("should allow a non-leader member to leave the party", async () => {
    // @ts-ignore
    await partyManagement.createParty(characterLeader, firstMember);
    await partyManagement.leaveParty(characterLeader, firstMember, firstMember);

    // @ts-ignore
    expect(await partyManagement.checkIfIsInParty(firstMember)).toBeFalsy();
    expect(messageSpy).toBeCalledWith(firstMember, "You left the party");
  });

  it("should not allow a non-leader member to remove other member", async () => {
    // @ts-ignore
    await partyManagement.createParty(characterLeader, firstMember);
    await partyManagement.leaveParty(characterLeader, secondMember, firstMember);

    expect(messageSpy).toBeCalledWith(firstMember, "You can't remove other members from the party");
  });

  // END LEAVE PARTY TESTS

  it("should delete a party if character is the leader", async () => {
    // @ts-ignore
    await partyManagement.createParty(characterLeader, firstMember);

    // @ts-ignore
    await partyManagement.deleteParty(characterLeader);

    expect(messageSpy).toHaveBeenCalledWith(characterLeader, "You have deleted the party");
  });

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

  it("should return undefined if the character is not part of a party", async () => {
    // @ts-ignore
    await partyManagement.createParty(characterLeader, firstMember);

    // @ts-ignore
    const party = await partyManagement.getPartyByCharacterId(thirdMember);

    expect(party).toBeNull();
  });

  it("should not delete a party if character is not the leader", async () => {
    // @ts-ignore
    await partyManagement.createParty(characterLeader, firstMember);

    // @ts-ignore
    expect(await partyManagement.checkIfIsInParty(characterLeader)).toBeTruthy();
    // @ts-ignore
    expect(await partyManagement.checkIfIsLeader(characterLeader._id)).toBeTruthy();

    // @ts-ignore
    await partyManagement.deleteParty(firstMember);

    expect(messageSpy).toHaveBeenCalledWith(firstMember, "You are not the party leader");
  });

  it("should not allow leader to transfer leadership to a character not in the same party", async () => {
    // @ts-ignore
    await partyManagement.createParty(characterLeader, firstMember);

    // @ts-ignore
    jest.spyOn(partyManagement, "checkIfSameParty").mockResolvedValue(false);

    // @ts-ignore
    const messageToPartyMembersSpy = jest.spyOn(partyManagement, "sendMessageToPartyMembers");

    await partyManagement.transferLeadership(characterLeader, secondMember, characterLeader);

    expect(messageToPartyMembersSpy).toHaveBeenCalledWith(characterLeader, "The target character is not in your party");
  });

  it("should not allow a character that's already in a party to create a new party", async () => {
    // @ts-ignore
    const createPartySpy = jest.spyOn(partyManagement, "createParty");

    await partyManagement.inviteOrCreateParty(characterLeader, firstMember, characterLeader);
    await partyManagement.inviteOrCreateParty(characterLeader, firstMember, characterLeader);

    expect(createPartySpy).toHaveBeenCalledTimes(1);

    (createPartySpy as jest.SpyInstance).mockRestore();
  });

  it("should not allow a character that's not a leader to invite another character", async () => {
    // create party
    await partyManagement.inviteOrCreateParty(characterLeader, firstMember, characterLeader);
    // invite party
    await partyManagement.inviteOrCreateParty(characterLeader, secondMember, firstMember);

    expect(messageSpy).toHaveBeenLastCalledWith(firstMember, "You are not the party leader");
  });

  it("should not allow to invite a character that's already in a party", async () => {
    // @ts-ignore
    await partyManagement.createParty(characterLeader, secondMember);
    // @ts-ignore
    await partyManagement.inviteToParty(characterLeader, secondMember);

    expect(messageSpy).toBeCalledWith(characterLeader, "Target is already in a party");
  });

  it("should not allow to invite a character when the party is full", async () => {
    // @ts-ignore
    await partyManagement.createParty(characterLeader, firstMember, 2);
    // @ts-ignore
    await partyManagement.inviteToParty(characterLeader, secondMember);
    // @ts-ignore
    expect(await partyManagement.checkIfIsInParty(secondMember)).toBeFalsy();

    expect(messageSpy).toBeCalledWith(characterLeader, "Your party is already full");
  });
  */
});
