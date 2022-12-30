import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { ItemSubType } from "@rpg-engine/shared";
import { CharacterCombatBonusPenalties } from "../characterBonusPenalties/CharacterCombatBonusPenalties";

describe("Case CharacterCombatBonusPenalties", () => {
  let testCharacter: ICharacter;
  let characterCombatBonusPenalties: CharacterCombatBonusPenalties;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();
    characterCombatBonusPenalties = container.get<CharacterCombatBonusPenalties>(CharacterCombatBonusPenalties);
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);
    testCharacter = await (
      await unitTestHelper.createMockCharacter(null, {
        hasEquipment: true,
        hasSkills: true,
        hasInventory: true,
      })
    )
      .populate("skills")
      .execPopulate();
  });

  it("updateCombatSkills should return the correct value", async () => {
    const skills = (await Skill.findById(testCharacter.skills)) as ISkill;
    let skillType = ItemSubType.Dagger;

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

    expect(skills!.dagger.skillPoints).toEqual(expect.closeTo(0.02, 2));

    skillType = ItemSubType.Sword;
    // First Call
    await characterCombatBonusPenalties.updateCombatSkills(skills, skillType, combatSkills);
    // Second Call
    await characterCombatBonusPenalties.updateCombatSkills(skills, skillType, combatSkills);

    expect(skills!.sword.skillPoints).toEqual(expect.closeTo(0.04, 2));
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
