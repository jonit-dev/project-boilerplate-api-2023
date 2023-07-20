import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { CharacterBuffActivator } from "@providers/character/characterBuff/CharacterBuffActivator";
import { container, unitTestHelper } from "@providers/inversify/container";
import { BasicAttribute, CharacterBuffDurationType, CharacterBuffType } from "@rpg-engine/shared";
import { SkillBuff } from "../SkillBuff";

describe("SkillBuff", () => {
  let characterBuffActivator: CharacterBuffActivator;
  let testCharacter: ICharacter;
  let skillBuff: SkillBuff;

  beforeAll(() => {
    characterBuffActivator = container.get(CharacterBuffActivator);
    skillBuff = container.get(SkillBuff);
  });

  beforeEach(async () => {
    testCharacter = (await unitTestHelper.createMockCharacter(null, { hasSkills: true })) as ICharacter;
  });

  it("should return skill with buffs", async () => {
    await characterBuffActivator.enablePermanentBuff(testCharacter, {
      type: CharacterBuffType.Skill,
      trait: BasicAttribute.Magic,
      buffPercentage: 10,
      durationType: CharacterBuffDurationType.Permanent,
    });

    const skills = await skillBuff.getSkillsWithBuff(testCharacter);

    expect(skills.magic.buffAndDebuff).toBe(1.1);
  });
});
