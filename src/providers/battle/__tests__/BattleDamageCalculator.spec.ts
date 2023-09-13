import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { container, unitTestHelper } from "@providers/inversify/container";

import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { CharacterClass, EntityType } from "@rpg-engine/shared";
import _ from "lodash";
import { BattleDamageCalculator } from "../BattleDamageCalculator";

describe("BattleDamageCalculator.spec.ts", () => {
  let battleDamageCalculator: BattleDamageCalculator;

  let testNPC: INPC;
  let testCharacter: ICharacter;

  beforeAll(() => {
    battleDamageCalculator = container.get<BattleDamageCalculator>(BattleDamageCalculator);

    // Set random as 50 to get the most likely Battle Event
    jest.spyOn(_, "random").mockImplementation(() => 51);
  });

  beforeEach(async () => {
    testNPC = await unitTestHelper.createMockNPC(null, { hasSkills: true });
    await testNPC.populate("skills").execPopulate();
    testCharacter = await unitTestHelper.createMockCharacter(null, { hasSkills: true, hasEquipment: true });
    await testCharacter.populate("skills").execPopulate();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Potential damage calculation", () => {
    it("should properly calculate potential damage", async () => {
      await testNPC.populate("skills").execPopulate();
      await testCharacter.populate("skills").execPopulate();

      // @ts-ignore
      const potentialDamage = await battleDamageCalculator.calculateTotalPotentialDamage(
        testCharacter.skills as ISkill,
        testNPC.skills as ISkill,
        false,
        undefined
      );

      expect(potentialDamage).toBe(2);
    });

    it("should properly calculate potential damage - influenced by skill level", async () => {
      const skillLvl = 100;
      const characterSkills = await Skill.findById(testCharacter.skills);
      expect(characterSkills).toBeDefined();
      characterSkills!.first.level = skillLvl;
      await characterSkills!.save();

      await testNPC.populate("skills").execPopulate();
      await testCharacter.populate("skills").execPopulate();

      // @ts-ignore
      const potentialDamage = await battleDamageCalculator.calculateTotalPotentialDamage(
        testCharacter.skills as ISkill,
        testNPC.skills as ISkill,
        false,
        undefined
      );

      expect(potentialDamage).toBe(skillLvl / 2 + 1);
    });
  });

  describe("Core functionality", () => {
    it("should properly calculate a hit damage", async () => {
      await testNPC.populate("skills").execPopulate();
      await testCharacter.populate("skills").execPopulate();

      // @ts-ignore
      jest.spyOn(battleDamageCalculator, "gaussianRandom").mockImplementation(() => 10);

      const hit = await battleDamageCalculator.calculateHitDamage(testCharacter, testNPC);

      expect(hit).toBeCloseTo(10, 0);
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

      // @ts-ignore
      jest.spyOn(battleDamageCalculator, "gaussianRandom").mockImplementation(() => 30);

      const hit = await battleDamageCalculator.calculateHitDamage(testNPC, testCharacter);

      expect(hit).toBe(15);
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
      // @ts-ignore
      jest.spyOn(battleDamageCalculator, "gaussianRandom").mockImplementation(() => 10);

      const hit = await battleDamageCalculator.calculateHitDamage(testNPC, testCharacter);

      expect(hit).toBe(5);
    });

    it("hit damage should be less or equal to target's health", async () => {
      await testNPC.populate("skills").execPopulate();
      await testCharacter.populate("skills").execPopulate();

      // @ts-ignore
      jest.spyOn(battleDamageCalculator, "gaussianRandom").mockImplementation(() => 1000);

      const hit = await battleDamageCalculator.calculateHitDamage(testCharacter, testNPC);

      expect(hit).toBe(testNPC.health);
    });
  });

  describe("Damage reduction", () => {
    let spyCalculateShieldingDefense: jest.SpyInstance;
    let spyCalculateRegularDefense: jest.SpyInstance;
    let spyDamageReduction: jest.SpyInstance;
    let attacker: INPC;
    let defender: ICharacter;
    let defenderSkills: ISkill;

    beforeEach(async () => {
      // @ts-ignore
      jest.spyOn(battleDamageCalculator, "calculateTotalPotentialDamage").mockImplementation(() => 100);

      // @ts-ignore
      spyCalculateShieldingDefense = jest.spyOn(battleDamageCalculator, "calculateCharacterShieldingDefense");

      // @ts-ignore
      spyCalculateRegularDefense = jest.spyOn(battleDamageCalculator, "calculateCharacterRegularDefense");

      // @ts-ignore
      spyDamageReduction = jest.spyOn(battleDamageCalculator, "calculateDamageReduction");

      attacker = await unitTestHelper.createMockNPC();

      defender = await unitTestHelper.createMockCharacter(null, { hasSkills: true });

      defenderSkills = (await Skill.findById(defender.skills)) as ISkill;

      defenderSkills.shielding.level = 10;
      defenderSkills.resistance.level = 10;
      defenderSkills.magicResistance.level = 10;

      await defenderSkills.save();

      await defender.populate("skills").execPopulate();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("calculates damage reduction if character has shield", async () => {
      // @ts-ignore
      jest.spyOn(battleDamageCalculator.characterWeapon, "hasShield").mockImplementation(() => true);

      await battleDamageCalculator.calculateHitDamage(attacker, defender, false);

      expect(spyDamageReduction).toHaveBeenCalled();
      expect(spyCalculateShieldingDefense).toHaveBeenCalled();
      // expect(spyCalculateRegularDefense).not.toHaveBeenCalled();

      expect(spyCalculateShieldingDefense).toHaveBeenCalledWith(
        defenderSkills.level,
        defenderSkills.resistance.level,
        defenderSkills.shielding.level
      );
    });

    it("calculates damage reduction based on magic resistance, if its a magic attack", async () => {
      // @ts-ignore
      jest.spyOn(battleDamageCalculator.characterWeapon, "hasShield").mockImplementation(() => false);

      await battleDamageCalculator.calculateHitDamage(attacker, defender, true);

      expect(spyDamageReduction).toHaveBeenCalled();
      expect(spyCalculateShieldingDefense).not.toHaveBeenCalled();
      expect(spyCalculateRegularDefense).toHaveBeenCalled();

      expect(spyCalculateRegularDefense).toHaveBeenCalledWith(
        defenderSkills.level,
        defenderSkills.magicResistance.level
      );
    });

    it("calculates damage reduction based on resistance only, if no shield is equipped and its not a magic attack", async () => {
      // @ts-ignore
      jest.spyOn(battleDamageCalculator.characterWeapon, "hasShield").mockImplementation(() => false);

      await battleDamageCalculator.calculateHitDamage(attacker, defender, false);

      expect(spyDamageReduction).toHaveBeenCalled();
      expect(spyCalculateShieldingDefense).not.toHaveBeenCalled();
      expect(spyCalculateRegularDefense).toHaveBeenCalled();

      const defenderSkills = defender.skills as ISkill;

      expect(spyCalculateRegularDefense).toHaveBeenCalledWith(defenderSkills.level, defenderSkills.resistance.level);
    });
  });

  describe("Edge cases - Invalid input", () => {
    it("hit damage should always be >= 0", async () => {
      // @ts-ignore
      jest.spyOn(battleDamageCalculator, "gaussianRandom").mockImplementation(() => 0);

      // @ts-ignore
      jest.spyOn(battleDamageCalculator.skillStatsCalculator, "getAttack").mockImplementation(() => 0);
      // @ts-ignore
      jest.spyOn(battleDamageCalculator.skillStatsCalculator, "getDefense").mockImplementation(() => 0);

      const hit = await battleDamageCalculator.calculateHitDamage(testCharacter, testNPC);

      expect(hit >= 0).toBeTruthy();

      // @ts-ignore
      jest.spyOn(battleDamageCalculator.skillStatsCalculator, "getMagicAttack").mockImplementation(() => 0);
      // @ts-ignore
      jest.spyOn(battleDamageCalculator.skillStatsCalculator, "getMagicDefense").mockImplementation(() => 0);

      const magicHit = await battleDamageCalculator.calculateHitDamage(testCharacter, testNPC);

      expect(magicHit >= 0).toBeTruthy();
    });
  });

  describe("pvp rogue attack damage increase", () => {
    let attacker: ICharacter;
    let defender: ICharacter;

    beforeEach(() => {
      // @ts-ignore
      jest.spyOn(battleDamageCalculator.characterWeapon, "getWeapon" as any).mockImplementation(() => {
        return null;
      });

      // @ts-ignore
      jest.spyOn(battleDamageCalculator, "calculateTotalPotentialDamage").mockImplementation(() => 100);

      jest
        // @ts-ignore
        .spyOn(battleDamageCalculator, "implementDamageReduction")
        // @ts-ignore
        .mockImplementation((defenderSkills, target, damage, isMagicAttack) => damage);

      // @ts-ignore
      jest.spyOn(_, "random").mockImplementation((a, b) => b);

      jest
        // @ts-ignore
        .spyOn(battleDamageCalculator, "gaussianRandom")
        // @ts-ignore
        .mockImplementation((meanDamage, stdDeviation) => meanDamage + stdDeviation);

      attacker = {
        class: CharacterClass.Rogue,
        type: EntityType.Character,
      } as unknown as ICharacter;

      defender = {
        type: EntityType.Character,
        health: 200,
      } as unknown as ICharacter;
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("attack damage should be increased", async () => {
      const damage = await battleDamageCalculator.calculateHitDamage(attacker, defender, false);
      expect(damage).toBe(94);
    });

    it("attack damage should not be increased if attacker is not rouge", async () => {
      attacker.class = CharacterClass.Berserker;
      const damage = await battleDamageCalculator.calculateHitDamage(attacker, defender, false);
      expect(damage).toBe(85);
    });

    it("attack damage should not be increased if battle is not pvp", async () => {
      defender.type = EntityType.NPC;
      const damage = await battleDamageCalculator.calculateHitDamage(attacker, defender, false);
      expect(damage).toBeCloseTo(85);
    });
  });
});
