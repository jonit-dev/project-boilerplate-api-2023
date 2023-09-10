import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment } from "@entities/ModuleCharacter/EquipmentModel";
import { Skill } from "@entities/ModuleCharacter/SkillsModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { BattleEventType } from "@rpg-engine/shared";
import _ from "lodash";
import { BattleEvent } from "../BattleEvent";

describe("BattleEvents.spec.ts", () => {
  let battleEvents: BattleEvent;

  let testNPC: INPC;
  let testCharacter: ICharacter;

  beforeAll(() => {
    battleEvents = container.get<BattleEvent>(BattleEvent);

    // Set random as 50 to get the most likely Battle Event
    jest.spyOn(_, "random").mockImplementation(() => 51);
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
      jest.spyOn(_, "random").mockImplementation(() => 10);

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
    jest.spyOn(_, "random").mockImplementation(() => 101);

    const event = await battleEvents.calculateEvent(testNPC, testCharacter);

    expect(event === BattleEventType.Miss).toBeTruthy();
  });

  it("ranged attackType should have more chances to hit", async () => {
    await testNPC.populate("skills").execPopulate();
    await testCharacter.populate("skills").execPopulate();

    // @ts-ignore
    const actionModifierSpy = jest.spyOn(battleEvents, "hasBattleEventSucceeded");

    jest.spyOn(_, "random").mockImplementation(() => 1000);

    const equipment = await Equipment.findById(testCharacter.equipment);

    if (!equipment) throw new Error("Equipment not found");

    equipment.leftHand = await unitTestHelper.createMockItemFromBlueprint(RangedWeaponsBlueprint.Bow);
    await equipment.save();

    await battleEvents.calculateEvent(testCharacter, testNPC);

    expect(actionModifierSpy).toHaveBeenCalled();
  });
});
