import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { BattleAttackTarget } from "../BattleAttackTarget";
import { BattleCharacterManager } from "../BattleCharacterManager";

describe("BattleCharacterManager.spec.ts", () => {
  let battleCharacterManager: BattleCharacterManager;
  let battleAttackTarget: BattleAttackTarget;

  let testNPC: INPC;
  let testCharacter: ICharacter;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();
    battleCharacterManager = container.get<BattleCharacterManager>(BattleCharacterManager);
    battleAttackTarget = container.get<BattleAttackTarget>(BattleAttackTarget);
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

  it("should return true is attackTarget succeeds", async () => {
    const attackTarget = await battleCharacterManager.attackTarget(testCharacter, testNPC);

    expect(attackTarget).toBeTruthy();
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});

// your code here
