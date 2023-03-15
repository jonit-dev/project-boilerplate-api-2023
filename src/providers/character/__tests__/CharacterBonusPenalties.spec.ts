import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { SkillFunctions } from "@providers/skill/SkillFunctions";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import {
  BasicAttribute,
  CharacterClass,
  CraftingSkill,
  ItemSubType,
  ShadowWalkerRaces,
  UISocketEvents,
} from "@rpg-engine/shared";
import { CharacterBonusPenalties } from "../characterBonusPenalties/CharacterBonusPenalties";

describe("Case CharacterBonusPenalties", () => {
  let testCharacter: ICharacter;
  let characterBonusPenalties: CharacterBonusPenalties;
  let sendEventToUser: jest.SpyInstance;
  let sendSkillLevelUpEvents: jest.SpyInstance;

  beforeAll(() => {
    characterBonusPenalties = container.get<CharacterBonusPenalties>(CharacterBonusPenalties);
    sendSkillLevelUpEvents = jest.spyOn(SkillFunctions.prototype, "sendSkillLevelUpEvents" as any);
  });

  beforeEach(async () => {
    testCharacter = await unitTestHelper.createMockCharacter(null, {
      hasEquipment: true,
      hasSkills: true,
    });

    testCharacter.race = ShadowWalkerRaces.Orc;
    testCharacter.class = CharacterClass.Berserker;

    (await Character.findByIdAndUpdate(testCharacter._id, { ...testCharacter }).lean()) as ICharacter;

    sendEventToUser = jest.spyOn(SocketMessaging.prototype, "sendEventToUser");
  });

  it("applyRaceBonusPenalties should return the correct value", async () => {
    const skills = (await Skill.findById(testCharacter.skills).lean()) as ISkill;

    skills.strength.skillPoints = 15;
    skills.strength.level = 2;

    skills.dagger.skillPoints = 15;
    skills.dagger.level = 2;

    skills.fishing.skillPoints = 15;
    skills.fishing.level = 2;

    skills.lumberjacking.skillPoints = 15;
    skills.lumberjacking.level = 2;

    (await Skill.findByIdAndUpdate(skills._id, { ...skills }).lean()) as ISkill;

    await characterBonusPenalties.applyRaceBonusPenalties(testCharacter, BasicAttribute.Strength);
    await characterBonusPenalties.applyRaceBonusPenalties(testCharacter, ItemSubType.Dagger);
    await characterBonusPenalties.applyRaceBonusPenalties(testCharacter, CraftingSkill.Fishing);
    await characterBonusPenalties.applyRaceBonusPenalties(testCharacter, CraftingSkill.Lumberjacking);

    const newSKill = (await Skill.findById(testCharacter.skills)) as ISkill;

    expect(newSKill!.strength.skillPoints).toEqual(15.64);
    expect(newSKill!.dagger.skillPoints).toEqual(15.32);
    expect(newSKill!.fishing.skillPoints).toEqual(15.44);
    expect(newSKill!.lumberjacking.skillPoints).toEqual(15.52);
  });

  it("applyRaceBonusPenalties should lvl up and send event", async () => {
    testCharacter.class = CharacterClass.Sorcerer;
    const skills = (await Skill.findById(testCharacter.skills).lean()) as ISkill;

    skills[BasicAttribute.Magic].skillPoints = 74;
    skills[BasicAttribute.Magic].level = 2;

    skills[CraftingSkill.Alchemy].skillPoints = 74;
    skills[CraftingSkill.Alchemy].level = 2;

    (await Skill.findByIdAndUpdate(skills._id, { ...skills }).lean()) as ISkill;

    await characterBonusPenalties.applyRaceBonusPenalties(testCharacter, BasicAttribute.Magic);
    await characterBonusPenalties.applyRaceBonusPenalties(testCharacter, CraftingSkill.Alchemy);

    const skillsAfterUpdate = (await Skill.findById(testCharacter.skills).lean()) as ISkill;

    expect(skillsAfterUpdate.magic.skillPoints).toEqual(74.96);
    expect(skillsAfterUpdate.magic.level).toEqual(3);
    expect(skillsAfterUpdate.magic.skillPointsToNextLevel).toEqual(101.04);

    expect(skillsAfterUpdate.alchemy.skillPoints).toEqual(74.4);
    expect(skillsAfterUpdate.alchemy.level).toEqual(3);
    expect(skillsAfterUpdate.alchemy.skillPointsToNextLevel).toEqual(101.6);

    expect(sendSkillLevelUpEvents).toHaveBeenCalled();
    expect(sendEventToUser).toHaveBeenCalledWith(testCharacter.channelId!, UISocketEvents.ShowMessage, {
      message: "You advanced from level 2 to 3 in Magic fighting.",
      type: "info",
    });
  });
});
