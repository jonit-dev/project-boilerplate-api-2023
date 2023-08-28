import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { PVP_MIN_REQUIRED_LV } from "@providers/constants/PVPConstants";
import { container, unitTestHelper } from "@providers/inversify/container";
import { EntityAttackType } from "@rpg-engine/shared";
import { BattleCharacterAttack } from "../BattleCharacterAttack";
import { BattleCharacterAttackValidation } from "../BattleCharacterAttackValidation";
import { SpecialEffect } from "@providers/entityEffects/SpecialEffect";

describe("BattleCharacterAttack.spec.ts", () => {
  let battleCharacterAttack: BattleCharacterAttack;
  let battleCharacterAttackValidation: BattleCharacterAttackValidation;

  let testNPC: INPC;
  let testCharacter: ICharacter;

  beforeAll(() => {
    battleCharacterAttack = container.get<BattleCharacterAttack>(BattleCharacterAttack);
    battleCharacterAttackValidation = container.get<BattleCharacterAttackValidation>(BattleCharacterAttackValidation);
  });

  beforeEach(async () => {
    testNPC = await unitTestHelper.createMockNPC(
      {
        health: 200,
        x: 3,
        y: 3,
      },
      { hasSkills: true }
    );

    testCharacter = await unitTestHelper.createMockCharacter(
      {
        health: 100,
        x: 0,
        y: 0,
      },
      { hasSkills: true }
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should avoid attacking dead targets", async () => {
    testNPC.health = 0;
    await testNPC.save();

    const attackTarget = await battleCharacterAttack.attackTarget(testCharacter, testNPC);

    expect(attackTarget).toBeFalsy();
  });

  it("should avoid attacking if attacker is dead", async () => {
    testCharacter.health = 0;
    (await Character.findByIdAndUpdate(testCharacter._id, testCharacter).lean()) as ICharacter;

    const attackTarget = await battleCharacterAttack.attackTarget(testCharacter, testNPC);

    expect(attackTarget).toBeFalsy();
  });

  it("should return true if attackTarget succeeds", async () => {
    const attackTarget = await battleCharacterAttack.attackTarget(testCharacter, testNPC);
    expect(attackTarget).toBeTruthy();
  });

  it("returns false if the target is the same as the attacker", async () => {
    const result = await battleCharacterAttack.attackTarget(testCharacter, testCharacter);
    expect(result).toBe(false);
  });

  it("returns false if the target is a character and is in a non-PVP zone", async () => {
    const result = await battleCharacterAttackValidation.canAttack(testCharacter, testCharacter);

    expect(result).toBe(false);
  });

  it("returns true if the attacker and target are alive, different, and in a PVP zone", async () => {
    const result = await battleCharacterAttackValidation.canAttack(testCharacter, testNPC);

    expect(result).toBe(true);
  });

  it("returns false if target is invisible", async () => {
    const isInvisible = jest.spyOn(SpecialEffect.prototype, "isInvisible");
    isInvisible.mockImplementation(() => Promise.resolve(true));

    const result = await battleCharacterAttackValidation.canAttack(testCharacter, testNPC);

    expect(result).toBe(false);
  });

  it("returns true if the attacker's level is too low to attack the target", async () => {
    // @ts-ignore
    const cancelTargetingSpy = jest.spyOn(battleCharacterAttackValidation.battleTargeting, "cancelTargeting");

    const attacker = {
      id: "123",
      isAlive: true,
      skills: {
        level: 2,
      },
      type: "Character",
    } as unknown as ICharacter;

    const target = {
      id: "321",
      isAlive: true,
      skills: {
        level: 10,
      },
      type: "Character",
    } as unknown as ICharacter;

    const result = await battleCharacterAttackValidation.canAttack(attacker, target);

    expect(result).toBe(false);

    expect(cancelTargetingSpy).toBeCalledWith(
      attacker,
      `PVP is restricted to level ${PVP_MIN_REQUIRED_LV} and above.`,
      target.id,
      "Character"
    );
  });

  it("returns true if the target's level is too low to be attacked by the attacker", async () => {
    // @ts-ignore
    const cancelTargetingSpy = jest.spyOn(battleCharacterAttackValidation.battleTargeting, "cancelTargeting");

    const attacker = {
      id: "123",
      isAlive: true,
      skills: {
        level: 12,
      },
      type: "Character",
    } as unknown as ICharacter;

    const target = {
      id: "321",
      isAlive: true,
      skills: {
        level: 5,
      },
      type: "Character",
    } as unknown as ICharacter;

    const result = await battleCharacterAttackValidation.canAttack(attacker, target);

    expect(result).toBe(false);

    expect(cancelTargetingSpy).toBeCalledWith(
      attacker,
      `You can't attack a target that's below level ${PVP_MIN_REQUIRED_LV}.`,
      target.id,
      "Character"
    );
  });

  it("returns false if the attacker's level is within range to attack the target", async () => {
    const attacker = {
      id: "123",
      isAlive: true,
      skills: {
        level: 12,
      },
      type: "Character",
      x: 0,
      y: 0,
      scene: "test",
      attackType: EntityAttackType.Melee,
    } as unknown as ICharacter;

    const target = {
      id: "321",
      isAlive: true,
      skills: {
        level: 12,
      },
      type: "Character",
      x: 16,
      y: 0,
      scene: "test",
      attackType: EntityAttackType.Melee,
    } as unknown as ICharacter;

    // @ts-ignore
    battleCharacterAttack.battleAttackTarget.hitTarget = jest.fn();

    const result = await battleCharacterAttackValidation.canAttack(attacker, target);

    expect(result).toBe(true);
  });

  // Out of range not working,
  // battleAttackTarget.checkRangeAndAttack(character, target) returns true

  // it("returns false if the target is out of range", async () => {
  //   testCharacter.x = 100;
  //   testCharacter.y = 100;
  //   testNPC.x = 0;
  //   testNPC.y = 0;

  //   const result = await battleCharacterManager.attackTarget(testCharacter, testNPC);

  //   expect(result).toBe(false);
  // });

  // it("returns true if the target is in range and the attack is successful", async () => {
  //   testCharacter.x = 0;
  //   testCharacter.y = 0;
  //   testNPC.x = 0;
  //   testNPC.y = 0;

  //   const result = await battleCharacterManager.attackTarget(testCharacter, testNPC);

  //   expect(result).toBe(true);
  // });

  // throw error
  // it("throws an error if the character or target could not be found in the database", async () => {
  //   testCharacter.x = 0;
  //   testCharacter.y = 0;
  //   testNPC.x = 0;
  //   testNPC.y = 0;

  //   // Delete the character and NPC from the database
  //   await testCharacter.remove();
  //   await testNPC.remove();

  //   expect(() => battleCharacterManager.attackTarget(testCharacter, testNPC)).toThrow();
  // });
});
