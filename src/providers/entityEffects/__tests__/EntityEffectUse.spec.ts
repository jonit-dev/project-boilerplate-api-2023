import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { EntityAttackType } from "@rpg-engine/shared";
import { EntityEffectCycle } from "../EntityEffectCycle";
import { EntityEffectUse } from "../EntityEffectUse";
import { entityEffectsBlueprintsIndex } from "../data";
import { IEntityEffect } from "../data/blueprints/entityEffect";
import { EntityEffectBlueprint } from "../data/types/entityEffectBlueprintTypes";

jest.mock("../EntityEffectCycle.ts", () => ({
  EntityEffectCycle: jest.fn(),
}));

describe("EntityEffectUse.ts", () => {
  let entityEffectUse: EntityEffectUse;
  let testAttacker: INPC;
  let testTarget: ICharacter;
  let poisonEntityEffect: IEntityEffect;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();
    entityEffectUse = container.get<EntityEffectUse>(EntityEffectUse);
  });
  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);

    testAttacker = await unitTestHelper.createMockNPC(null, {});

    poisonEntityEffect = entityEffectsBlueprintsIndex[EntityEffectBlueprint.Poison];

    testAttacker.entityEffects = [poisonEntityEffect.key];

    testTarget = await unitTestHelper.createMockCharacter(null, {});
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });

  it("creates a testAttacker with entityEffects (poison)", () => {
    expect(testAttacker.entityEffects).toBeDefined();
  });

  it("should not call EntityEffectCycle if there are no EntityEffect", async () => {
    testAttacker.entityEffects = [];

    await testAttacker.save();

    await entityEffectUse.applyEntityEffects(testTarget, testAttacker);

    expect(EntityEffectCycle).not.toHaveBeenCalled();
  });

  it("should call EntityEffectCycle if there are EntityEffect and probability is maximum", async () => {
    poisonEntityEffect.probability = 100;

    await entityEffectUse.applyEntityEffects(testTarget, testAttacker);

    expect(EntityEffectCycle).toHaveBeenCalled();
  });

  it("should not call EntityEffectCycle if there are EntityEffect and probability is minimum", async () => {
    poisonEntityEffect.probability = 0;

    await entityEffectUse.applyEntityEffects(testTarget, testAttacker);

    expect(EntityEffectCycle).not.toHaveBeenCalled();
  });

  it("should not call EntityEffectCycle if character already has an effect applied", async () => {
    testTarget.appliedEntityEffects = [poisonEntityEffect.key];
    await testTarget.save();

    await entityEffectUse.applyEntityEffects(testTarget, testAttacker);

    expect(EntityEffectCycle).not.toHaveBeenCalled();
  });

  it("should not call EntityEffectCycle if the target is not a character or NPC", async () => {
    const invalidTarget = {};
    await entityEffectUse.applyEntityEffects(invalidTarget as any, testAttacker);
    expect(EntityEffectCycle).not.toHaveBeenCalled();
  });

  describe("Attack types", () => {
    beforeEach(() => {
      poisonEntityEffect.probability = 100;
    });
    it("should not call applyEntityEffects when attacker attack type Melee and no entity effects", async () => {
      testAttacker.entityEffects = [];
      testAttacker.attackType = EntityAttackType.Melee;
      await testAttacker.save();

      await entityEffectUse.applyEntityEffects(testTarget, testAttacker);

      expect(EntityEffectCycle).not.toHaveBeenCalled();
    });
    it("should not call applyEntityEffects when attacker attack type is Ranged and entity effects attack type Melee", async () => {
      testAttacker.entityEffects = [EntityEffectBlueprint.Poison];
      testAttacker.attackType = EntityAttackType.Ranged;
      await testAttacker.save();

      await entityEffectUse.applyEntityEffects(testTarget, testAttacker);

      expect(EntityEffectCycle).not.toHaveBeenCalled();
    });
    it("should call applyEntityEffects and attacker attack type melee and entity effects attack type Melee", async () => {
      testAttacker.entityEffects = [EntityEffectBlueprint.Poison];
      testAttacker.attackType = EntityAttackType.Melee;
      await testAttacker.save();

      await entityEffectUse.applyEntityEffects(testTarget, testAttacker);

      expect(EntityEffectCycle).toHaveBeenCalled();
    });
    it("should call applyEntityEffects when battle event is a hit and attacker attack type MeleeRanged and entity effects attack type Melee", async () => {
      testAttacker.entityEffects = [EntityEffectBlueprint.Poison];
      testAttacker.attackType = EntityAttackType.MeleeRanged;
      await testAttacker.save();

      await entityEffectUse.applyEntityEffects(testTarget, testAttacker);

      expect(EntityEffectCycle).toHaveBeenCalled();
    });
  });
});
