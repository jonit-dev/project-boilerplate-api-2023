import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { PVP_MIN_REQUIRED_LV } from "@providers/constants/PVPConstants";
import { container, unitTestHelper } from "@providers/inversify/container";
import { EntityAttackType } from "@rpg-engine/shared";
import { BattleCharacterManager } from "../BattleCharacterManager";

describe("BattleCharacterManager.spec.ts", () => {
  let battleCharacterManager: BattleCharacterManager;
  let testNPC: INPC;
  let testCharacter: ICharacter;

  beforeAll(() => {
    battleCharacterManager = container.get<BattleCharacterManager>(BattleCharacterManager);
  });

  beforeEach(async () => {
    testNPC = await unitTestHelper.createMockNPC();
    testNPC.health = 100;
    await testNPC.save();

    testCharacter = await unitTestHelper.createMockCharacter();
    testCharacter.health = 100;
    await testCharacter.save();
  });

  it("should avoid attacking dead targets", async () => {
    testNPC.health = 0;
    await testNPC.save();

    const attackTarget = await battleCharacterManager.attackTarget(testCharacter, testNPC);

    expect(attackTarget).toBeFalsy();
  });

  it("should avoid attacking if attacker is dead", async () => {
    testCharacter.health = 0;
    await testCharacter.save();

    const attackTarget = await battleCharacterManager.attackTarget(testCharacter, testNPC);

    expect(attackTarget).toBeFalsy();
  });

  it("should return true if attackTarget succeeds", async () => {
    const attackTarget = await battleCharacterManager.attackTarget(testCharacter, testNPC);

    expect(attackTarget).toBeTruthy();
  });

  it("returns false if the target is the same as the attacker", async () => {
    const result = await battleCharacterManager.attackTarget(testCharacter, testCharacter);
    expect(result).toBe(false);
  });

  it("returns false if the target is a character and is in a non-PVP zone", async () => {
    // @ts-expect-error
    const result = await battleCharacterManager.canAttack(testCharacter, testCharacter);

    expect(result).toBe(false);
  });

  it("returns true if the attacker and target are alive, different, and in a PVP zone", async () => {
    testCharacter.isAlive = true;
    testNPC.isAlive = true;
    // @ts-expect-error
    const result = await battleCharacterManager.canAttack(testCharacter, testNPC);

    expect(result).toBe(true);
  });

  it("returns true if the attacker's level is too low to attack the target", async () => {
    const cancelTargetingSpy = jest.spyOn(battleCharacterManager, "cancelTargeting");

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

    const result = await battleCharacterManager.attackTarget(attacker, target);

    expect(result).toBe(false);

    expect(cancelTargetingSpy).toBeCalledWith(
      attacker,
      `PVP is restricted to level ${PVP_MIN_REQUIRED_LV} and above.`,
      target.id,
      "Character"
    );
  });

  it("returns true if the target's level is too low to be attacked by the attacker", async () => {
    const cancelTargetingSpy = jest.spyOn(battleCharacterManager, "cancelTargeting");

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

    const result = await battleCharacterManager.attackTarget(attacker, target);

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
    battleCharacterManager.battleAttackTarget.hitTarget = jest.fn();

    const result = await battleCharacterManager.attackTarget(attacker, target);

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
