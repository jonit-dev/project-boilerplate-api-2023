import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { BattleEventType, FromGridX } from "@rpg-engine/shared";
import { BattleAttackTarget } from "../BattleAttackTarget";

describe("BattleAttackTarget.spec.ts", () => {
  let battleAttackTarget: BattleAttackTarget;

  let testNPC: INPC;
  let testCharacter: ICharacter;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();
    battleAttackTarget = container.get<BattleAttackTarget>(BattleAttackTarget);
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);

    testNPC = await unitTestHelper.createMockNPC();
    testCharacter = await unitTestHelper.createMockCharacter();

    testCharacter.x = FromGridX(0);
    testCharacter.y = FromGridX(0);
    await testCharacter.save();

    testNPC.x = FromGridX(1);
    testNPC.y = FromGridX(1);
    await testNPC.save();
  });

  it("should NOT hit a target if attacker has melee attack type and target is out of range", async () => {
    const attacker = testCharacter;
    attacker.x = FromGridX(0);
    attacker.y = FromGridX(0);
    await attacker.save();

    const defender = testNPC;
    defender.x = FromGridX(5);
    defender.y = FromGridX(5);
    await defender.save();

    await battleAttackTarget.checkRangeAndAttack(attacker, defender);

    // expect battleAttackTarget to not have been called

    const hitTarget = jest.spyOn(battleAttackTarget, "hitTarget" as any);

    expect(hitTarget).not.toHaveBeenCalled();
  });

  it("should hit a target if attacker has melee attack type and target is in range", async () => {
    await battleAttackTarget.checkRangeAndAttack(testNPC, testCharacter);

    // expect battleAttackTarget to not have been called

    const hitTarget = jest.spyOn(battleAttackTarget, "hitTarget" as any);

    expect(hitTarget).toHaveBeenCalled();
  });

  it("when battle event is a hit, it should decrease the target's health", async () => {
    // @ts-ignore
    jest.spyOn(battleAttackTarget.battleEvent, "calculateEvent" as any).mockImplementation(() => BattleEventType.Hit);
    // @ts-ignore
    jest.spyOn(battleAttackTarget.battleEvent, "calculateHitDamage" as any).mockImplementation(() => 50);

    // @ts-ignore
    await battleAttackTarget.hitTarget(testCharacter, testNPC);

    expect(testNPC.health).toBeLessThan(testNPC.maxHealth);
  });

  it("when battle event is a miss, it should not decrease the target's health", async () => {
    // @ts-ignore
    jest.spyOn(battleAttackTarget.battleEvent, "calculateEvent" as any).mockImplementation(() => BattleEventType.Miss);

    // @ts-ignore
    await battleAttackTarget.hitTarget(testCharacter, testNPC);

    expect(testNPC.health).toBe(testNPC.maxHealth);
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});

// your code here
