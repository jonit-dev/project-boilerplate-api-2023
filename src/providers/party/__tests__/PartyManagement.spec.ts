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
  let messageSpy: jest.SpyInstance;

  beforeAll(async () => {
    partyManagement = container.get<PartyManagement>(PartyManagement);

    // @ts-ignore
    messageSpy = jest.spyOn(partyManagement.socketMessaging, "sendErrorMessageToCharacter");

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
  });

  beforeEach(() => {
    messageSpy.mockClear();
  });

  afterEach(() => {
    messageSpy.mockClear();
    messageSpy.mockClear();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it("should create a party", async () => {
    await partyManagement.createParty(characterLeader, firstMember);

    // @ts-ignore
    expect(await partyManagement.checkIfIsInParty(characterLeader)).toBeTruthy();
    // @ts-ignore
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

    // @ts-ignore
    expect(await partyManagement.checkIfIsLeader(characterLeader._id)).toBeTruthy();
    // @ts-ignore
    expect(await partyManagement.checkIfIsLeader(firstMember)).toBeFalsy();
  });

  // it("should transfer leadership without removing the old leader", async () => {
  //   await partyManagement.createParty(characterLeader, firstMember);
  //   await partyManagement.transferLeadership(characterLeader, firstMember, false);

  //   // @ts-ignore
  //   expect(await partyManagement.checkIfIsLeader(characterLeader._id)).toBeFalsy();
  //   // @ts-ignore
  //   expect(await partyManagement.checkIfIsLeader(firstMember)).toBeTruthy();

  //   // @ts-ignore
  //   expect(await partyManagement.checkIfIsInParty(characterLeader)).toBeTruthy();
  // });

  // it("should transfer leadership and remove the old leader", async () => {
  //   await partyManagement.createParty(characterLeader, firstMember);

  //   await partyManagement.transferLeadership(characterLeader, firstMember, true);

  //   // @ts-ignore
  //   expect(await partyManagement.checkIfIsLeader(characterLeader._id)).toBeFalsy();
  //   // @ts-ignore
  //   expect(await partyManagement.checkIfIsLeader(firstMember)).toBeTruthy();

  //   // @ts-ignore
  //   expect(await partyManagement.checkIfIsInParty(characterLeader)).toBeFalsy();
  //   // @ts-ignore
  //   expect(await partyManagement.checkIfIsLeader(characterLeader._id)).toBeFalsy();
  // });

  it("should a leader be able to invite a character to the party", async () => {
    await partyManagement.createParty(characterLeader, firstMember);

    // @ts-ignore
    expect(await partyManagement.checkIfIsInParty(firstMember)).toBeTruthy();

    await partyManagement.inviteToParty(characterLeader, secondMember);
    // @ts-ignore
    expect(await partyManagement.checkIfIsInParty(secondMember)).toBeTruthy();
  });

  it("should send success messages when a character is successfully invited", async () => {
    await partyManagement.createParty(characterLeader, firstMember);

    await partyManagement.inviteToParty(characterLeader, secondMember);

    expect(messageSpy).toBeCalledWith(characterLeader, `You invited ${secondMember.name} to your party`);

    expect(messageSpy).toBeCalledWith(secondMember, `${characterLeader.name} invited you to their party`);
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
  // it("should allow a leader to remove a member", async () => {
  //   await partyManagement.createParty(characterLeader, firstMember);

  //   await partyManagement.leaveParty(characterLeader, firstMember);

  //   // @ts-ignore
  //   expect(await partyManagement.checkIfIsInParty(firstMember)).toBeFalsy();

  //   expect(messageSpy).toBeCalledWith(firstMember, "You left the party");

  //   expect(messageSpy).toBeCalledWith(characterLeader, `You removed ${firstMember.name} from the party`);
  // });

  it("should not allow non-leader character to remove members", async () => {
    await partyManagement.createParty(characterLeader, firstMember);

    await partyManagement.leaveParty(firstMember, characterLeader);

    expect(messageSpy).toBeCalledWith(firstMember, "You can't remove other members from the party");
  });

  it("should allow a leader to remove themselves and close party", async () => {
    await partyManagement.createParty(characterLeader, firstMember);
    await partyManagement.leaveParty(characterLeader, characterLeader);

    // @ts-ignore
    expect(await partyManagement.checkIfIsInParty(characterLeader)).toBeFalsy();
    // @ts-ignore
    expect(await partyManagement.checkIfIsInParty(firstMember)).toBeFalsy();
  });

  it("should not allow a leader to remove a character that's not in the party", async () => {
    await partyManagement.createParty(characterLeader, firstMember);

    await partyManagement.leaveParty(characterLeader, thirdMember);

    expect(messageSpy).toBeCalledWith(characterLeader, "The target character is not in your party");
  });

  it("should allow a non-leader member to leave the party", async () => {
    await partyManagement.createParty(characterLeader, firstMember);
    await partyManagement.leaveParty(firstMember, firstMember);

    // @ts-ignore
    expect(await partyManagement.checkIfIsInParty(firstMember)).toBeFalsy();
    expect(messageSpy).toBeCalledWith(firstMember, "You left the party");
  });

  it("should not allow a non-leader member to remove other member", async () => {
    await partyManagement.createParty(characterLeader, firstMember);
    await partyManagement.leaveParty(firstMember, secondMember);

    expect(messageSpy).toBeCalledWith(firstMember, "You can't remove other members from the party");
  });

  // END LEAVE PARTY TESTS

  it("should delete a party if character is the leader", async () => {
    await partyManagement.createParty(characterLeader, firstMember);

    // @ts-ignore
    await partyManagement.deleteParty(characterLeader);

    expect(messageSpy).toHaveBeenCalledWith(characterLeader, "You have deleted the party");
  });

  it("should return a party if the character is the leader", async () => {
    await partyManagement.createParty(characterLeader, firstMember);

    // @ts-ignore
    const party = await partyManagement.getPartyByCharacterId(characterLeader);

    expect(party).toBeDefined();
    expect(party?.leader._id).toEqual(characterLeader._id);
  });

  it("should return a party if the character is a member", async () => {
    await partyManagement.createParty(characterLeader, firstMember);

    // @ts-ignore
    const party = await partyManagement.getPartyByCharacterId(firstMember);

    expect(party).toBeDefined();
    expect(party?.members.some((member) => member._id.toString() === firstMember._id.toString())).toBeTruthy();
  });

  it("should return undefined if the character is not part of a party", async () => {
    await partyManagement.createParty(characterLeader, firstMember);

    // @ts-ignore
    const party = await partyManagement.getPartyByCharacterId(thirdMember);

    expect(party).toBeNull();
  });

  it("should not delete a party if character is not the leader", async () => {
    await partyManagement.createParty(characterLeader, firstMember);

    // @ts-ignore
    expect(await partyManagement.checkIfIsInParty(characterLeader)).toBeTruthy();
    // @ts-ignore
    expect(await partyManagement.checkIfIsLeader(characterLeader._id)).toBeTruthy();

    // @ts-ignore
    await partyManagement.deleteParty(firstMember);

    expect(messageSpy).toHaveBeenCalledWith(firstMember, "You are not the party leader");
  });

  // it("should not allow leader to transfer leadership to a character not in the same party", async () => {
  //   await partyManagement.createParty(characterLeader, firstMember);

  //   // @ts-ignore
  //   jest.spyOn(partyManagement, "checkIfSameParty").mockResolvedValue(false);

  //   let error;
  //   try {
  //     await partyManagement.transferLeadership(characterLeader, secondMember, false);
  //   } catch (e) {
  //     error = e;
  //   }

  //   expect(error).toBeDefined();
  //   expect(error.message).toEqual("Leader and target are not in the same party");
  // });

  it("should not allow a character that's already in a party to create a new party", async () => {
    await partyManagement.createParty(characterLeader, firstMember);

    await partyManagement.createParty(characterLeader, secondMember);

    expect(messageSpy).toBeCalledWith(characterLeader, "You are already in a party");
  });

  it("should throw an error if the target is already in a party", async () => {
    await partyManagement.createParty(characterLeader, firstMember);

    await partyManagement.createParty(characterLeader, firstMember);

    expect(messageSpy).toBeCalledWith(characterLeader, "You are already in a party");
  });

  // it("should not allow a character that's not a leader to invite another character", async () => {
  //   await partyManagement.createParty(characterLeader, firstMember);

  //   await partyManagement.inviteToParty(firstMember, firstMember);

  //   expect(messageSpy).toBeCalledWith(firstMember, "You are not a party leader");
  // });

  it("should not allow to invite a character that's already in a party", async () => {
    await partyManagement.createParty(characterLeader, secondMember);

    await partyManagement.inviteToParty(characterLeader, secondMember);

    expect(messageSpy).toBeCalledWith(characterLeader, "Target is already in a party");
  });

  // it("should not allow to invite a character when the party is full", async () => {
  //   await partyManagement.createParty(characterLeader, firstMember, 2);

  //   await partyManagement.inviteToParty(characterLeader, secondMember);
  //   // @ts-ignore
  //   expect(await partyManagement.checkIfIsInParty(secondMember)).toBeFalsy();

  //   expect(messageSpy).toBeCalledWith(characterLeader, "Your party is already full");
  // });
});
