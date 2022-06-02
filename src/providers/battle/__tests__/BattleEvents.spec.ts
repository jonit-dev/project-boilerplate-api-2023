import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Skill } from "@entities/ModuleCharacter/SkillsModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { BattleEventType } from "@rpg-engine/shared";
import _ from "lodash";
import { BattleEvent } from "../BattleEvent";

describe("BattleEvents.spec.ts", () => {
  let battleEvents: BattleEvent;

  let testNPC: INPC;
  let testCharacter: ICharacter;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();
    battleEvents = container.get<BattleEvent>(BattleEvent);

    jest.spyOn(_, "random").mockImplementation(() => 0);
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);

    testNPC = await unitTestHelper.createMockNPC();
    testCharacter = await unitTestHelper.createMockCharacter();
  });

  it("should properly calculate a hit or miss event", async () => {
    const event = await battleEvents.calculateEvent(testNPC, testCharacter);

    expect(event === BattleEventType.Hit || event === BattleEventType.Miss).toBeTruthy();
  });

  it("expect to miss if defender's dexterity is too high", async () => {
    const defenderSkills = await Skill.findOne({ owner: testCharacter._id });

    if (defenderSkills) {
      defenderSkills.dexterity = 100;
      await defenderSkills.save();

      await testCharacter.populate("skills").execPopulate(); // refresh skills data

      const event = battleEvents.calculateEvent(testNPC, testCharacter);

      expect(event).toBe(BattleEventType.Miss);
    }
  });

  it("expect to hit if defender's dexterity is low and attacker's dexterity is high", async () => {
    const attackerSkills = await Skill.findOne({ owner: testCharacter._id });
    const defenderSkills = await Skill.findOne({ owner: testNPC._id });

    if (attackerSkills && defenderSkills) {
      attackerSkills.dexterity = 10000;
      defenderSkills.dexterity = 0;
      await attackerSkills.save();
      await defenderSkills.save();

      // refresh skills data post update
      await testNPC.populate("skills").execPopulate();
      await testCharacter.populate("skills").execPopulate();

      const event = battleEvents.calculateEvent(testCharacter, testNPC);

      expect(event).toBe(BattleEventType.Hit);
    }
  });

  it("should properly calculate a hit damage", async () => {
    await testNPC.populate("skills").execPopulate();
    await testCharacter.populate("skills").execPopulate();

    jest.spyOn(_, "random").mockImplementation(() => 10);

    const hit = battleEvents.calculateHitDamage(testCharacter, testNPC);

    expect(hit).toBe(10);
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});

// your code here
