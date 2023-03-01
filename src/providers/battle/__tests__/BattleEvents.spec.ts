import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment } from "@entities/ModuleCharacter/EquipmentModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
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

  it("should give a max damage of 1 for a training item", async () => {
    await testNPC.populate("skills").execPopulate();
    await testCharacter.populate("skills").execPopulate();

    jest.spyOn(_, "random").mockRestore();
    // @ts-ignore
    const spy = jest.spyOn(battleEvents.characterWeapon, "getWeapon" as any).mockImplementation(() => {
      return { isTraining: true };
    });

    const hit = await battleEvents.calculateHitDamage(testCharacter, testNPC);

    expect(hit).toBeLessThanOrEqual(1);
    spy.mockReset();
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

    expect(hit).toBe(20);
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

  describe("Edge cases - Invalid input", () => {
    it("hit damage should always be >= 0", async () => {
      jest.spyOn(_, "random").mockImplementation(() => 0);

      // @ts-ignore
      jest.spyOn(battleEvents.skillStatsCalculator, "getAttack").mockImplementation(() => 0);
      // @ts-ignore
      jest.spyOn(battleEvents.skillStatsCalculator, "getDefense").mockImplementation(() => 0);

      const hit = await battleEvents.calculateHitDamage(testCharacter, testNPC);

      expect(hit >= 0).toBeTruthy();

      // @ts-ignore
      jest.spyOn(battleEvents.skillStatsCalculator, "getMagicAttack").mockImplementation(() => 0);
      // @ts-ignore
      jest.spyOn(battleEvents.skillStatsCalculator, "getMagicDefense").mockImplementation(() => 0);

      const magicHit = await battleEvents.calculateHitDamage(testCharacter, testNPC);

      expect(magicHit >= 0).toBeTruthy();
    });
  });

  describe("Damage reduction", () => {
    let spyCalculateShieldingDefense: jest.SpyInstance;
    let spyCalculateRegularDefense: jest.SpyInstance;
    let spyDamageReduction: jest.SpyInstance;
    let attacker: INPC;
    let defender: ICharacter;

    beforeEach(() => {
      // @ts-ignore
      jest.spyOn(battleEvents, "calculateTotalPotentialDamage").mockImplementation(() => 100);

      // @ts-ignore
      spyCalculateShieldingDefense = jest.spyOn(battleEvents, "calculateCharacterShieldingDefense");

      // @ts-ignore
      spyCalculateRegularDefense = jest.spyOn(battleEvents, "calculateCharacterRegularDefense");

      // @ts-ignore
      spyDamageReduction = jest.spyOn(battleEvents, "calculateDamageReduction");

      attacker = {} as INPC;

      defender = {
        _id: testCharacter._id,
        type: "Character",
        skills: {
          shielding: {
            level: 10,
          },
          resistance: {
            level: 10,
          },
          magicResistance: {
            level: 10,
          },
        },
      } as unknown as ICharacter;
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("calculates damage reduction if character has shield", async () => {
      // @ts-ignore
      jest.spyOn(battleEvents.characterWeapon, "hasShield").mockImplementation(() => true);

      await battleEvents.calculateHitDamage(attacker, defender, false);

      expect(spyDamageReduction).toHaveBeenCalled();
      expect(spyCalculateShieldingDefense).toHaveBeenCalled();
      // expect(spyCalculateRegularDefense).not.toHaveBeenCalled();

      const defenderSkills = defender.skills as ISkill;

      expect(spyCalculateShieldingDefense).toHaveBeenCalledWith(
        defenderSkills.level,
        defenderSkills.resistance.level,
        defenderSkills.shielding.level
      );
    });

    it("calculates damage reduction based on magic resistance, if its a magic attack", async () => {
      // @ts-ignore
      jest.spyOn(battleEvents.characterWeapon, "hasShield").mockImplementation(() => false);

      await battleEvents.calculateHitDamage(attacker, defender, true);

      expect(spyDamageReduction).toHaveBeenCalled();
      expect(spyCalculateShieldingDefense).not.toHaveBeenCalled();
      expect(spyCalculateRegularDefense).toHaveBeenCalled();

      const defenderSkills = defender.skills as ISkill;

      expect(spyCalculateRegularDefense).toHaveBeenCalledWith(
        defenderSkills.level,
        defenderSkills.magicResistance.level
      );
    });

    it("calculates damage reduction based on resistance only, if no shield is equipped and its not a magic attack", async () => {
      // @ts-ignore
      jest.spyOn(battleEvents.characterWeapon, "hasShield").mockImplementation(() => false);

      await battleEvents.calculateHitDamage(attacker, defender, false);

      expect(spyDamageReduction).toHaveBeenCalled();
      expect(spyCalculateShieldingDefense).not.toHaveBeenCalled();
      expect(spyCalculateRegularDefense).toHaveBeenCalled();

      const defenderSkills = defender.skills as ISkill;

      expect(spyCalculateRegularDefense).toHaveBeenCalledWith(defenderSkills.level, defenderSkills.resistance.level);
    });
  });
});
