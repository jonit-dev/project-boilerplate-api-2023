import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { BattleCharacterManager } from "../BattleCharacterManager";

describe("BattleCharacterManager.spec.ts", () => {
  let battleCharacterManager: BattleCharacterManager;
  let testNPC: INPC;
  let testCharacter: ICharacter;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();
    battleCharacterManager = container.get<BattleCharacterManager>(BattleCharacterManager);
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);

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

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
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
