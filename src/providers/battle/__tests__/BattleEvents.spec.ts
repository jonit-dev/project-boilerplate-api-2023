import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Skill } from "@entities/ModuleCharacter/SkillsModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { BattleEventType, ISkill } from "@rpg-engine/shared";
import _ from "lodash";
import { BattleEvent } from "../BattleEvent";

describe("BattleEvents.spec.ts", () => {
  let battleEvents: BattleEvent;

  let testNPC: INPC;
  let testCharacter: ICharacter;

  beforeAll(() => {
    battleEvents = container.get<BattleEvent>(BattleEvent);

    // Set random as 50 to get the most likely Battle Event
    jest.spyOn(_, "random").mockImplementation(() => 50);
  });

  beforeEach(async () => {
    testNPC = await unitTestHelper.createMockNPC(null, { hasSkills: true });
    await testNPC.populate("skills").execPopulate();
    testCharacter = await unitTestHelper.createMockCharacter(null, { hasSkills: true, hasEquipment: true });
    await testCharacter.populate("skills").execPopulate();
  });

  it("should properly calculate a hit", async () => {
    const event = await battleEvents.calculateEvent(testNPC, testCharacter);

    expect(event === BattleEventType.Hit).toBeTruthy();
  });

  it("expect to block if defender's dexterity is too high", async () => {
    const defenderSkills = await Skill.findOne({ owner: testCharacter._id });

    if (defenderSkills) {
      defenderSkills.dexterity.level = 100;
      await defenderSkills.save();

      await testCharacter.populate("skills").execPopulate(); // refresh skills data

      const event = await battleEvents.calculateEvent(testNPC, testCharacter);

      expect(event).toBe(BattleEventType.Block);
    }
  });

  it("expect to hit if defender's dexterity is low and attacker's dexterity is high", async () => {
    const attackerSkills = await Skill.findOne({ owner: testCharacter._id });
    const defenderSkills = await Skill.findOne({ owner: testNPC._id });

    if (attackerSkills && defenderSkills) {
      attackerSkills.dexterity.level = 10000;
      defenderSkills.dexterity.level = 0;
      await attackerSkills.save();
      await defenderSkills.save();

      // refresh skills data post update
      await testNPC.populate("skills").execPopulate();
      await testCharacter.populate("skills").execPopulate();

      const event = await battleEvents.calculateEvent(testCharacter, testNPC);

      expect(event).toBe(BattleEventType.Hit);
    }
  });

  it("should properly calculate a miss event", async () => {
    // 50% chance to hit and 50% chance to block
    // with random = 51 will miss (each event is calculated independently)
    jest.spyOn(_, "random").mockImplementation(() => 51);

    const event = await battleEvents.calculateEvent(testNPC, testCharacter);

    expect(event === BattleEventType.Miss).toBeTruthy();
  });

  it("should properly calculate a hit damage", async () => {
    await testNPC.populate("skills").execPopulate();
    await testCharacter.populate("skills").execPopulate();

    jest.spyOn(_, "random").mockImplementation(() => 10);

    const hit = await battleEvents.calculateHitDamage(testCharacter, testNPC);

    expect(hit).toBe(10);
  });

  it("should properly calculate a hit damage with damage reduction", async () => {
    await testNPC.populate("skills").execPopulate();
    await testCharacter.populate("skills").execPopulate();
    const skills = await Skill.findById(testCharacter.skills);

    skills!.level = 25;
    skills!.resistance.level = 25;
    skills!.shielding.level = 30;
    await skills!.save();

    await testCharacter.populate("skills").execPopulate();

    jest.spyOn(_, "random").mockImplementation(() => 30);

    const hit = await battleEvents.calculateHitDamage(testNPC, testCharacter);

    expect(hit).toBe(17);
  });

  it("If damage is low and shield lvl high, should not reduce and take the normal damage", async () => {
    await testNPC.populate("skills").execPopulate();
    await testCharacter.populate("skills").execPopulate();
    const skills = await Skill.findById(testCharacter.skills);

    skills!.level = 25;
    skills!.resistance.level = 25;
    skills!.shielding.level = 30;
    await skills!.save();

    await testCharacter.populate("skills").execPopulate();

    jest.spyOn(_, "random").mockImplementation(() => 10);

    const hit = await battleEvents.calculateHitDamage(testNPC, testCharacter);

    expect(hit).toBe(10);
  });

  it("hit damage should be less or equal to target's health", async () => {
    await testNPC.populate("skills").execPopulate();
    await testCharacter.populate("skills").execPopulate();

    jest.spyOn(_, "random").mockImplementation(() => 1000);

    const hit = await battleEvents.calculateHitDamage(testCharacter, testNPC);

    expect(hit).toBe(testNPC.health);
  });
});
