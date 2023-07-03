import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import PartyManagement, {
  CharacterPartyBenefits,
  CharacterPartyDistributionBonus,
  CharacterPartyDropBonus,
  CharacterPartyEXPBonus,
  CharacterPartySkillBonus,
} from "../PartyManagement";
import { CharacterClass } from "@rpg-engine/shared";

describe("Party Benefits", () => {
  let partyManagement: PartyManagement;
  let characterLeader: ICharacter;
  let firstMember: ICharacter;
  let secondMember: ICharacter;

  beforeAll(async () => {
    partyManagement = container.get<PartyManagement>(PartyManagement);

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
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it("should calculate benefits for a party of size 2 with 2 unique classes", () => {
    const result = partyManagement.calculatePartyBenefits(2, 2);
    expect(result).toEqual([
      {
        benefit: CharacterPartyBenefits.Distribution,
        value: CharacterPartyDistributionBonus.Two,
      },
      {
        benefit: CharacterPartyBenefits.Experience,
        value: CharacterPartyEXPBonus.Two,
      },
      {
        benefit: CharacterPartyBenefits.DropRatio,
        value: CharacterPartyDropBonus.Two,
      },
      {
        benefit: CharacterPartyBenefits.Skill,
        value: CharacterPartySkillBonus.Two,
      },
    ]);
  });

  it("should calculate benefits for a party of size 3 with 1 unique class", () => {
    const result = partyManagement.calculatePartyBenefits(3, 1);
    expect(result).toEqual([
      {
        benefit: CharacterPartyBenefits.Distribution,
        value: CharacterPartyDistributionBonus.Three,
      },
      {
        benefit: CharacterPartyBenefits.Experience,
        value: CharacterPartyEXPBonus.One,
      },
      {
        benefit: CharacterPartyBenefits.DropRatio,
        value: CharacterPartyDropBonus.Three,
      },
      {
        benefit: CharacterPartyBenefits.Skill,
        value: CharacterPartySkillBonus.Three,
      },
    ]);
  });

  it("should calculate correct benefits for a party with 2 members", async () => {
    await partyManagement.createParty(characterLeader, firstMember);

    // @ts-ignore
    const party = await partyManagement.getPartyByCharacterId(characterLeader._id);

    const expectedBenefits = partyManagement.calculatePartyBenefits(
      2,
      characterLeader.class === firstMember.class ? 1 : 2
    );

    expect(party!.benefits!.map(({ benefit, value }) => ({ benefit, value }))).toEqual(expectedBenefits);
  });

  it("should calculate correct benefits for a party with 3 members", async () => {
    await partyManagement.createParty(characterLeader, firstMember);
    await partyManagement.inviteToParty(characterLeader, secondMember);

    // @ts-ignore
    const party = await partyManagement.getPartyByCharacterId(characterLeader._id);

    const expectedBenefits = partyManagement.calculatePartyBenefits(3, 3);

    expect(party!.benefits!.map(({ benefit, value }) => ({ benefit, value }))).toEqual(expectedBenefits);
  });

  it("should update benefits when a party member is removed", async () => {
    await partyManagement.createParty(characterLeader, firstMember);
    await partyManagement.inviteToParty(characterLeader, secondMember);

    await partyManagement.leaveParty(secondMember, secondMember);

    // @ts-ignore
    const party = await partyManagement.getPartyByCharacterId(characterLeader._id);

    const expectedBenefits = partyManagement.calculatePartyBenefits(2, 2);

    expect(party!.benefits!.map(({ benefit, value }) => ({ benefit, value }))).toEqual(expectedBenefits);
  });
});
