import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { EntityAttackType } from "@rpg-engine/shared";
import _ from "lodash";
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
  let entityEffectSpy;

  beforeAll(() => {
    entityEffectUse = container.get<EntityEffectUse>(EntityEffectUse);
  });
  beforeEach(async () => {
    testAttacker = await unitTestHelper.createMockNPC(null, {});

    poisonEntityEffect = entityEffectsBlueprintsIndex[EntityEffectBlueprint.Poison];

    testAttacker.entityEffects = [poisonEntityEffect.key];

    testTarget = await unitTestHelper.createMockCharacter(null, {});

    // @ts-ignore
    entityEffectSpy = jest.spyOn(entityEffectUse, "startEntityEffectCycle");
  });

  afterEach(() => {
    jest.clearAllMocks();
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

    const randomMock = jest.spyOn(_, "random");
    // make it always return 0
    randomMock.mockReturnValue(0);

    await entityEffectUse.applyEntityEffects(testTarget, testAttacker);

    expect(entityEffectSpy).toHaveBeenCalledTimes(1);
  });

  it("should not call EntityEffectCycle if there are EntityEffect and probability is minimum", async () => {
    poisonEntityEffect.probability = 0;

    await entityEffectUse.applyEntityEffects(testTarget, testAttacker);

    expect(entityEffectSpy).not.toHaveBeenCalled();
  });

  it("should not call EntityEffectCycle if character already has an effect applied", async () => {
    testTarget.appliedEntityEffects = [poisonEntityEffect.key];
    await testTarget.save();

    await entityEffectUse.applyEntityEffects(testTarget, testAttacker);

    expect(entityEffectSpy).not.toHaveBeenCalled();
  });

  it("should not call EntityEffectCycle if the target is not a character or NPC", async () => {
    const invalidTarget = {};
    await entityEffectUse.applyEntityEffects(invalidTarget as any, testAttacker);
    expect(entityEffectSpy).not.toHaveBeenCalled();
  });

  it("should clear all entity effects when clearAllEntityEffects is called", async () => {
    testTarget.appliedEntityEffects = [poisonEntityEffect.key];
    await testTarget.save();

    await entityEffectUse.clearAllEntityEffects(testTarget);

    // Refresh testTarget from the database
    const refreshedTestTarget = await Character.findById(testTarget._id);

    expect(refreshedTestTarget?.appliedEntityEffects).toHaveLength(0);
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

      expect(entityEffectSpy).not.toHaveBeenCalled();
    });
    it("should not call applyEntityEffects when attacker attack type is Ranged and entity effects attack type Melee", async () => {
      testAttacker.entityEffects = [EntityEffectBlueprint.Poison];
      testAttacker.attackType = EntityAttackType.Ranged;
      await testAttacker.save();

      await entityEffectUse.applyEntityEffects(testTarget, testAttacker);

      expect(entityEffectSpy).not.toHaveBeenCalled();
    });
    it("should call applyEntityEffects when attacker attack type is Melee and entity effects attack type Melee", async () => {
      testAttacker.entityEffects = [EntityEffectBlueprint.Poison];
      testAttacker.attackType = EntityAttackType.Melee;
      await testAttacker.save();

      await entityEffectUse.applyEntityEffects(testTarget, testAttacker);

      expect(entityEffectSpy).toHaveBeenCalled();
    });
    it("should call applyEntityEffects when attacker attack type is MeleeRanged and entity effects attack type Melee", async () => {
      testAttacker.entityEffects = [EntityEffectBlueprint.Poison];
      testAttacker.attackType = EntityAttackType.MeleeRanged;
      await testAttacker.save();

      await entityEffectUse.applyEntityEffects(testTarget, testAttacker);

      expect(entityEffectSpy).toHaveBeenCalled();
    });
  });
});
