import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill } from "@entities/ModuleCharacter/SkillsModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { CharacterCombatBonusPenalties } from "../characterBonusPenalties/CharacterCombatBonusPenalties";

describe("Case CharacterCombatBonusPenalties", () => {
  let testCharacter: ICharacter;
  let characterCombatBonusPenalties: CharacterCombatBonusPenalties;
  let skills: ISkill;
  beforeAll(() => {
    jest.useFakeTimers({
      advanceTimers: true,
    });

    characterCombatBonusPenalties = container.get<CharacterCombatBonusPenalties>(CharacterCombatBonusPenalties);
  });

  beforeEach(async () => {
    testCharacter = await unitTestHelper.createMockCharacter(null, {
      hasEquipment: true,
      hasSkills: true,
      hasInventory: true,
    });

    await testCharacter.populate("skills").execPopulate();

    skills = testCharacter.skills as ISkill;
  });

  it("updateCombatSkills should return the correct value", async () => {
    const skillType = "dagger";

    const combatSkills = {
      first: 0.1,
      sword: 0.1,
      dagger: 0.1,
      axe: 0.2,
      distance: -0.1,
      shielding: 0.1,
      club: 0.2,
    };

    await characterCombatBonusPenalties.updateCombatSkills(skills, skillType, combatSkills);

    expect(skills!.dagger.skillPoints).toEqual(expect.closeTo(0.22, 2));

    // skillType = "sword";
    // // First Call
    // await characterCombatBonusPenalties.updateCombatSkills(skills, skillType, combatSkills);
    // // Second Call
    // await characterCombatBonusPenalties.updateCombatSkills(skills, skillType, combatSkills);

    // expect(skills!.sword.skillPoints).toEqual(expect.closeTo(0.44, 2));
  });
});
