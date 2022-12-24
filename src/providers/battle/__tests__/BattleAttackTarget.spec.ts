import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment, IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { StaffsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { BasicAttribute, BattleEventType, FromGridX, FromGridY } from "@rpg-engine/shared";
import { BattleAttackTarget } from "../BattleAttackTarget";

jest.mock("../../entityEffects/EntityEffectCycle.ts", () => ({
  EntityEffectCycle: jest.fn(),
}));

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
    testNPC = await unitTestHelper.createMockNPC(null, { hasSkills: true });
    testCharacter = await unitTestHelper.createMockCharacter(null, {
      hasEquipment: true,
      hasSkills: true,
    });
    await testNPC.populate("skills").execPopulate();
    await testCharacter.populate("skills").execPopulate();

    testCharacter.x = FromGridX(0);
    testCharacter.y = FromGridX(0);
    await testCharacter.save();

    testNPC.x = FromGridX(1);
    testNPC.y = FromGridX(1);
    await testNPC.save();
  });

  it("should NOT hit a target if attacker has melee attack type and target is out of range", async () => {
    const hitTarget = jest.spyOn(battleAttackTarget, "hitTarget" as any);

    const attacker = testCharacter;
    attacker.x = FromGridX(0);
    attacker.y = FromGridY(0);
    await attacker.save();

    const defender = testNPC;
    defender.x = FromGridX(5);
    defender.y = FromGridY(5);
    await defender.save();

    await battleAttackTarget.checkRangeAndAttack(attacker, defender);

    // expect battleAttackTarget to not have been called

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
    const increaseSkillsOnBattle = jest.spyOn(battleAttackTarget.skillIncrease, "increaseSkillsOnBattle" as any);

    // @ts-ignore
    await battleAttackTarget.hitTarget(testCharacter, testNPC);

    expect(testNPC.health).toBeLessThan(testNPC.maxHealth);
    expect(increaseSkillsOnBattle).toHaveBeenCalled();
  });

  it("when battle event is a miss, it should not decrease the target's health", async () => {
    // @ts-ignore
    jest.spyOn(battleAttackTarget.battleEvent, "calculateEvent" as any).mockImplementation(() => BattleEventType.Miss);

    // @ts-ignore
    await battleAttackTarget.hitTarget(testCharacter, testNPC);

    expect(testNPC.health).toBe(testNPC.maxHealth);
  });

  it("NPC should clear its target, after killing a character", async () => {
    // @ts-ignore
    jest.spyOn(battleAttackTarget.battleEvent, "calculateEvent" as any).mockImplementation(() => BattleEventType.Hit);
    // @ts-ignore
    jest.spyOn(battleAttackTarget.battleEvent, "calculateHitDamage" as any).mockImplementation(() => 200);

    // @ts-ignore
    const charDeath = jest.spyOn(battleAttackTarget.characterDeath, "handleCharacterDeath");

    testCharacter.health = 1;
    await testCharacter.save();

    // @ts-ignore
    await battleAttackTarget.hitTarget(testNPC, testCharacter);

    expect(charDeath).toHaveBeenCalled();

    expect(testNPC.targetCharacter).toBe(undefined);
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});

describe("BattleAttackTarget.spec.ts | PVP battle", () => {
  let battleAttackTarget: BattleAttackTarget;

  let targetCharacter: ICharacter;
  let attackerCharacter: ICharacter;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();
    battleAttackTarget = container.get<BattleAttackTarget>(BattleAttackTarget);
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);

    targetCharacter = await unitTestHelper.createMockCharacter(null, {
      hasEquipment: true,
      hasSkills: true,
    });
    attackerCharacter = await unitTestHelper.createMockCharacter(null, {
      hasEquipment: true,
      hasSkills: true,
    });
    await targetCharacter.populate("skills").execPopulate();
    await attackerCharacter.populate("skills").execPopulate();

    attackerCharacter.x = FromGridX(0);
    attackerCharacter.y = FromGridX(0);
    await attackerCharacter.save();

    targetCharacter.x = FromGridX(1);
    targetCharacter.y = FromGridX(1);
    await targetCharacter.save();
  });

  it("should NOT hit a target if attacker has melee attack type and target is out of range", async () => {
    const hitTarget = jest.spyOn(battleAttackTarget, "hitTarget" as any);

    const attacker = attackerCharacter;
    attacker.x = FromGridX(0);
    attacker.y = FromGridY(0);
    await attacker.save();

    const defender = targetCharacter;
    defender.x = FromGridX(5);
    defender.y = FromGridY(5);
    await defender.save();

    await battleAttackTarget.checkRangeAndAttack(attacker, defender);

    // expect battleAttackTarget to not have been called

    expect(hitTarget).not.toHaveBeenCalled();
  });

  it("should hit a target if attacker has melee attack type and target is in range", async () => {
    // expect battleAttackTarget to have been called
    const hitTarget = jest.spyOn(battleAttackTarget, "hitTarget" as any);

    await battleAttackTarget.checkRangeAndAttack(targetCharacter, attackerCharacter);

    expect(hitTarget).toHaveBeenCalled();
  });

  it("when battle event is a hit, it should decrease the target's health", async () => {
    // @ts-ignore
    jest.spyOn(battleAttackTarget.battleEvent, "calculateEvent" as any).mockImplementation(() => BattleEventType.Hit);
    // @ts-ignore
    jest.spyOn(battleAttackTarget.battleEvent, "calculateHitDamage" as any).mockImplementation(() => 50);

    // @ts-ignore
    const increaseSkillsOnBattle = jest.spyOn(battleAttackTarget.skillIncrease, "increaseSkillsOnBattle" as any);

    // @ts-ignore
    await battleAttackTarget.hitTarget(attackerCharacter, targetCharacter);

    expect(targetCharacter.health).toBeLessThan(targetCharacter.maxHealth);
    expect(increaseSkillsOnBattle).toHaveBeenCalled();
  });

  it("when battle event is a miss, it should not decrease the target's health", async () => {
    // @ts-ignore
    jest.spyOn(battleAttackTarget.battleEvent, "calculateEvent" as any).mockImplementation(() => BattleEventType.Miss);

    // @ts-ignore
    await battleAttackTarget.hitTarget(attackerCharacter, targetCharacter);

    expect(targetCharacter.health).toBe(targetCharacter.maxHealth);
  });

  describe("magic staff ranged attack", () => {
    beforeEach(async () => {
      const characterEquipment = (await Equipment.findById(attackerCharacter.equipment)
        .populate("inventory")
        .exec()) as IEquipment;
      const res = await unitTestHelper.createMockItemFromBlueprint(StaffsBlueprint.FireStaff);
      characterEquipment!.rightHand = res.id;

      await characterEquipment!.save();
    });

    it("when battle event is a hit, it should increase target magic resistance", async () => {
      // @ts-ignore
      jest.spyOn(battleAttackTarget.battleEvent, "calculateEvent" as any).mockImplementation(() => BattleEventType.Hit);
      // @ts-ignore
      jest.spyOn(battleAttackTarget.battleEvent, "calculateHitDamage" as any).mockImplementation(() => 50);

      // @ts-ignore
      const increaseSkillsOnBattle = jest.spyOn(battleAttackTarget.skillIncrease, "increaseBasicAttributeSP" as any);

      // @ts-ignore
      await battleAttackTarget.hitTarget(attackerCharacter, targetCharacter);

      expect(increaseSkillsOnBattle).toHaveBeenCalledWith(targetCharacter, BasicAttribute.MagicResistance);
    });
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
