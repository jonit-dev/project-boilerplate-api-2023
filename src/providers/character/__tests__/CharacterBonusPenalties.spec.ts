import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { SkillFunctions } from "@providers/skill/SkillFunctions";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { BasicAttribute, ItemSubType, UISocketEvents } from "@rpg-engine/shared";
import { CharacterBonusPenalties } from "../characterBonusPenalties/CharacterBonusPenalties";

describe("Case CharacterBonusPenalties", () => {
  let testCharacter: ICharacter;
  let characterBonusPenalties: CharacterBonusPenalties;
  let sendEventToUser: jest.SpyInstance;
  let sendSkillLevelUpEvents: jest.SpyInstance;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();
    characterBonusPenalties = container.get<CharacterBonusPenalties>(CharacterBonusPenalties);

    sendSkillLevelUpEvents = jest.spyOn(SkillFunctions.prototype, "sendSkillLevelUpEvents" as any);
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);
    testCharacter = await (
      await unitTestHelper.createMockCharacter(null, {
        hasEquipment: true,
        hasSkills: true,
      })
    )
      .populate("skills")
      .execPopulate();
    testCharacter.race = "Orc";

    sendEventToUser = jest.spyOn(SocketMessaging.prototype, "sendEventToUser");
  });

  it("applyRaceBonusPenalties should return the correct value", async () => {
    const skillTypeStrength = BasicAttribute.Strength;
    const skills = (await Skill.findById(testCharacter.skills).lean({ virtuals: true, defaults: true })) as ISkill;

    skills!.strength.skillPoints = 15;
    skills!.strength.level = 2;
    skills!.dagger.skillPoints = 15;
    skills!.dagger.level = 2;

    await Skill.findByIdAndUpdate(skills._id, { ...skills });

    await characterBonusPenalties.applyRaceBonusPenalties(testCharacter, skillTypeStrength);

    const skillTypeDagger = ItemSubType.Dagger;
    await characterBonusPenalties.applyRaceBonusPenalties(testCharacter, skillTypeDagger);

    const newSKill = (await Skill.findById(testCharacter.skills).lean({ virtuals: true, defaults: true })) as ISkill;
    expect(newSKill!.strength.skillPoints).toEqual(15.48);

    expect(newSKill!.dagger.skillPoints).toEqual(15.44);
  });

  it("applyRaceBonusPenalties should lvl up and send event", async () => {
    const skills = (await Skill.findById(testCharacter.skills)) as ISkill;
    const skillType = BasicAttribute.Strength;
    skills[skillType].skillPoints = 63.5;
    skills[skillType].level = 3;

    await Skill.findByIdAndUpdate(skills._id, { ...skills });

    await characterBonusPenalties.applyRaceBonusPenalties(testCharacter, skillType);

    const skillsAfterUpdate = (await Skill.findById(testCharacter.skills)) as ISkill;
    expect(skillsAfterUpdate!.strength.skillPoints).toEqual(expect.closeTo(64.22, 2));
    expect(skillsAfterUpdate!.strength.level).toEqual(4);
    expect(skillsAfterUpdate!.strength.skillPointsToNextLevel).toEqual(60.78);

    expect(sendSkillLevelUpEvents).toHaveBeenCalled();
    expect(sendEventToUser).toHaveBeenCalledWith(testCharacter.channelId!, UISocketEvents.ShowMessage, {
      message: "You advanced from level 3 to 4 in Strength fighting.",
      type: "info",
    });
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
