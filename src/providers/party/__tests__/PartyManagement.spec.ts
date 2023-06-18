import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import PartyManagement from "../PartyManagement";
import { CharacterClass } from "@rpg-engine/shared";
import { CharacterParty, ICharacterParty } from "@entities/ModuleCharacter/CharacterPartyModel";

describe("Party Management", () => {
  let partyManagement: PartyManagement;
  let characterLeader: ICharacter;
  let firstMember: ICharacter;
  let secondMember: ICharacter;
  let thirdMember: ICharacter;
  let errorMessageSpy: jest.SpyInstance;
  let successMessageSpy: jest.SpyInstance;

  beforeAll(async () => {
    partyManagement = container.get<PartyManagement>(PartyManagement);

    // @ts-ignore
    errorMessageSpy = jest.spyOn(partyManagement.socketMessaging, "sendErrorMessageToCharacter");
    // @ts-ignore
    successMessageSpy = jest.spyOn(partyManagement.socketMessaging, "sendMessageToCharacter");

    characterLeader = await unitTestHelper.createMockCharacter(null, {
      hasSkills: true,
    });

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
  });

  beforeEach(() => {
    errorMessageSpy.mockClear();
    successMessageSpy.mockClear();
  });

  afterEach(() => {
    errorMessageSpy.mockClear();
    successMessageSpy.mockClear();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it("should create a party", async () => {
    await partyManagement.createParty(characterLeader, firstMember);

    expect(await partyManagement.checkIfIsInParty(characterLeader)).toBeTruthy();
    expect(await partyManagement.checkIfIsInParty(firstMember)).toBeTruthy();
  });

  it("should create a party with a custom max size", async () => {
    await partyManagement.createParty(characterLeader, firstMember, 3);

    const party = (await CharacterParty.findOne({ "leader._id": characterLeader._id })
      .lean()
      .select("maxSize members")) as ICharacterParty;

    expect(party.maxSize).toBe(3);
  });

  it("should check leader in party", async () => {
    await partyManagement.createParty(characterLeader, firstMember);

    expect(await partyManagement.checkIfIsLeader(characterLeader)).toBeTruthy();
    expect(await partyManagement.checkIfIsLeader(firstMember)).toBeFalsy();
  });

  it("should transfer leadership without removing the old leader", async () => {
    await partyManagement.createParty(characterLeader, firstMember);
    console.log("leader", characterLeader._id, "member", firstMember._id);
    await partyManagement.transferLeadership(characterLeader, firstMember, false);

    expect(await partyManagement.checkIfIsLeader(characterLeader)).toBeFalsy();
    expect(await partyManagement.checkIfIsLeader(firstMember)).toBeTruthy();

    expect(await partyManagement.checkIfIsInParty(characterLeader)).toBeTruthy();
  });

  it("should transfer leadership and remove the old leader", async () => {
    await partyManagement.createParty(characterLeader, firstMember);

    await partyManagement.transferLeadership(characterLeader, firstMember, true);

    expect(await partyManagement.checkIfIsLeader(characterLeader)).toBeFalsy();
    expect(await partyManagement.checkIfIsLeader(firstMember)).toBeTruthy();

    expect(await partyManagement.checkIfIsInParty(characterLeader)).toBeFalsy();
    expect(await partyManagement.checkIfIsLeader(characterLeader)).toBeFalsy();
  });

  it("should a leader be able to invite a character to the party", async () => {
    await partyManagement.createParty(characterLeader, firstMember);

    expect(await partyManagement.checkIfIsInParty(firstMember)).toBeTruthy();

    await partyManagement.inviteToParty(characterLeader, secondMember);

    expect(await partyManagement.checkIfIsInParty(secondMember)).toBeTruthy();
  });

  it("should send success messages when a character is successfully invited", async () => {
    await partyManagement.createParty(characterLeader, firstMember);

    await partyManagement.inviteToParty(characterLeader, secondMember);

    expect(successMessageSpy).toBeCalledWith(characterLeader, `You invited ${secondMember.name} to your party`);

    expect(successMessageSpy).toBeCalledWith(secondMember, `${characterLeader.name} invited you to their party`);
  });

  it("should check if two characters are in the same party", async () => {
    await partyManagement.createParty(characterLeader, firstMember);

    // @ts-ignore
    const areInSameParty = await partyManagement.checkIfSameParty(characterLeader, firstMember);

    expect(areInSameParty).toBeTruthy();
  });

  it("should check if two characters are not in the same party", async () => {
    await partyManagement.createParty(characterLeader, firstMember);

    await partyManagement.createParty(secondMember, thirdMember);

    // @ts-ignore
    const areInSameParty = await partyManagement.checkIfSameParty(characterLeader, thirdMember);

    expect(areInSameParty).toBeFalsy();
  });

  // LEAVE PARTY TESTS
  it("should allow a leader to remove a member", async () => {
    await partyManagement.createParty(characterLeader, firstMember);

    await partyManagement.leaveParty(characterLeader, firstMember);

    expect(await partyManagement.checkIfIsInParty(firstMember)).toBeFalsy();

    expect(successMessageSpy).toBeCalledWith(firstMember, "You left the party");

    expect(successMessageSpy).toBeCalledWith(characterLeader, `You removed ${firstMember.name} from the party`);
  });

  it("should not allow non-leader character to remove members", async () => {
    await partyManagement.createParty(characterLeader, firstMember);

    await partyManagement.leaveParty(firstMember, characterLeader);

    expect(errorMessageSpy).toBeCalledWith(firstMember, "You can't remove other members from the party");
  });

  it("should allow a leader to remove themselves and close party", async () => {
    await partyManagement.createParty(characterLeader, firstMember);
    await partyManagement.leaveParty(characterLeader, characterLeader);

    expect(await partyManagement.checkIfIsInParty(characterLeader)).toBeFalsy();
    expect(await partyManagement.checkIfIsInParty(firstMember)).toBeFalsy();
  });

  it("should not allow a leader to remove a character that's not in the party", async () => {
    await partyManagement.createParty(characterLeader, firstMember);

    await partyManagement.leaveParty(characterLeader, thirdMember);

    expect(errorMessageSpy).toBeCalledWith(characterLeader, "The target character is not in your party");
  });

  it("should allow a non-leader member to leave the party", async () => {
    await partyManagement.createParty(characterLeader, firstMember);
    await partyManagement.leaveParty(firstMember, firstMember);

    expect(await partyManagement.checkIfIsInParty(firstMember)).toBeFalsy();
    expect(successMessageSpy).toBeCalledWith(firstMember, "You left the party");
  });

  it("should not allow a non-leader member to remove other member", async () => {
    await partyManagement.createParty(characterLeader, firstMember);
    await partyManagement.leaveParty(firstMember, secondMember);

    expect(errorMessageSpy).toBeCalledWith(firstMember, "You can't remove other members from the party");
  });

  // END LEAVE PARTY TESTS

  it("should delete a party if character is the leader", async () => {
    await partyManagement.createParty(characterLeader, firstMember);

    // @ts-ignore
    await partyManagement.deleteParty(characterLeader);

    expect(successMessageSpy).toHaveBeenCalledWith(characterLeader, "You have deleted the party");
  });

  it("should return a party if the character is the leader", async () => {
    await partyManagement.createParty(characterLeader, firstMember);

    // @ts-ignore
    const party = await partyManagement.findPartyByCharacterId(characterLeader);

    expect(party).toBeDefined();
    expect(party?.leader._id).toEqual(characterLeader._id);
  });

  it("should return a party if the character is a member", async () => {
    await partyManagement.createParty(characterLeader, firstMember);

    // @ts-ignore
    const party = await partyManagement.findPartyByCharacterId(firstMember);

    expect(party).toBeDefined();
    expect(party?.members.some((member) => member._id.toString() === firstMember._id.toString())).toBeTruthy();
  });

  it("should return undefined if the character is not part of a party", async () => {
    await partyManagement.createParty(characterLeader, firstMember);

    // @ts-ignore
    const party = await partyManagement.findPartyByCharacterId(thirdMember);

    expect(party).toBeNull();
  });

  it("should not delete a party if character is not the leader", async () => {
    await partyManagement.createParty(characterLeader, firstMember);

    expect(await partyManagement.checkIfIsInParty(characterLeader)).toBeTruthy();
    expect(await partyManagement.checkIfIsLeader(characterLeader)).toBeTruthy();

    // @ts-ignore
    await partyManagement.deleteParty(firstMember);

    expect(errorMessageSpy).toHaveBeenCalledWith(firstMember, "You are not the party leader");
  });

  it("should not allow leader to transfer leadership to a character not in the same party", async () => {
    await partyManagement.createParty(characterLeader, firstMember);

    // @ts-ignore
    jest.spyOn(partyManagement, "checkIfSameParty").mockResolvedValue(false);

    let error;
    try {
      await partyManagement.transferLeadership(characterLeader, secondMember, false);
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    expect(error.message).toEqual("Leader and target are not in the same party");
  });

  it("should not allow a character that's already in a party to create a new party", async () => {
    await partyManagement.createParty(characterLeader, firstMember);

    await partyManagement.createParty(characterLeader, secondMember);

    expect(errorMessageSpy).toBeCalledWith(characterLeader, "You are already in a party");
  });

  it("should throw an error if the target is already in a party", async () => {
    await partyManagement.createParty(characterLeader, firstMember);

    await partyManagement.createParty(characterLeader, firstMember);

    expect(errorMessageSpy).toBeCalledWith(characterLeader, "You are already in a party");
  });

  it("should not allow a character that's not a leader to invite another character", async () => {
    await partyManagement.createParty(characterLeader, firstMember);

    await partyManagement.inviteToParty(firstMember, firstMember);

    expect(errorMessageSpy).toBeCalledWith(firstMember, "You are not a party leader");
  });

  it("should not allow to invite a character that's already in a party", async () => {
    await partyManagement.createParty(characterLeader, secondMember);

    await partyManagement.inviteToParty(characterLeader, secondMember);

    expect(errorMessageSpy).toBeCalledWith(characterLeader, "Target is already in a party");
  });

  it("should not allow to invite a character when the party is full", async () => {
    await partyManagement.createParty(characterLeader, firstMember, 2);
    await partyManagement.inviteToParty(characterLeader, secondMember);

    expect(await partyManagement.checkIfIsInParty(secondMember)).toBeFalsy();

    expect(errorMessageSpy).toBeCalledWith(characterLeader, "Your party is already full");
  });
});
