import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { CharacterClass, CombatSkill, ItemSubType, ShadowWalkerRaces } from "@rpg-engine/shared";
import { CharacterCombatBonusPenalties } from "../characterBonusPenalties/CharacterCombatBonusPenalties";

describe("Case CharacterCombatBonusPenalties", () => {
  let testCharacter: ICharacter;
  let characterCombatBonusPenalties: CharacterCombatBonusPenalties;

  beforeAll(() => {
    characterCombatBonusPenalties = container.get<CharacterCombatBonusPenalties>(CharacterCombatBonusPenalties);
  });

  beforeEach(async () => {
    testCharacter = await await unitTestHelper.createMockCharacter(null, {
      hasEquipment: true,
      hasSkills: true,
      hasInventory: true,
    });

    testCharacter.race = ShadowWalkerRaces.Orc;
    testCharacter.class = CharacterClass.Berserker;

    (await Character.findByIdAndUpdate(testCharacter._id, { ...testCharacter }).lean()) as ICharacter;
  });

  it("updateCombatSkills should return the correct value", async () => {
    const skills = (await Skill.findById(testCharacter.skills).lean()) as ISkill;

    const combatSkills = {
      first: 0.1,
      sword: 0.1,
      dagger: 0.1,
      axe: 0.2,
      distance: -0.1,
      shielding: 0.1,
      club: 0.2,
    };

    await characterCombatBonusPenalties.updateCombatSkills(skills, CombatSkill.Dagger, combatSkills);

    expect(skills.dagger.skillPoints).toEqual(expect.closeTo(0.22, 2));

    // First Call
    await characterCombatBonusPenalties.updateCombatSkills(skills, CombatSkill.Sword, combatSkills);
    // Second Call
    await characterCombatBonusPenalties.updateCombatSkills(skills, CombatSkill.Sword, combatSkills);

    expect(skills.sword.skillPoints).toEqual(expect.closeTo(0.44, 2));
  });
});
