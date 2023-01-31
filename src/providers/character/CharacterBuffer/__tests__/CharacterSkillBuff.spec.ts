import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { CharacterSkillBuff } from "../CharacterSkillBuff";

describe("updateBasicAttribute", () => {
  let testCharacter: ICharacter;
  let characterSkillBuff: CharacterSkillBuff;

  beforeAll(() => {
    characterSkillBuff = container.get<CharacterSkillBuff>(CharacterSkillBuff);
  });

  beforeEach(async () => {
    testCharacter = await (
      await unitTestHelper.createMockCharacter(null, {
        hasEquipment: true,
        hasSkills: true,
      })
    )
      .populate("skills")
      .execPopulate();
  });

  describe("enablePermanentBuff", () => {
    it("should return the updated basic attribute buff when skillType is BasicAttributes", async () => {
      const buff = 500; // 500%
      const skillType = "strength";
      const result = await characterSkillBuff.enablePermanentBuff(testCharacter, skillType, buff);
      const skill = (await Skill.findById(testCharacter.skills)) as ISkill;

      expect(skill.strength.level).toEqual(6);
      expect(result).toEqual({ _id: result._id, key: "strength", value: 5 });
    });
  });
});
