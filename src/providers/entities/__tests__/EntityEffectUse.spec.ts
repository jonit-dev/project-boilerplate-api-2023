import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { IEntityEffect } from "../data/blueprints/entityEffect";
import { EntityEffectUse } from "../EntityEffectUse";

describe("EntityEffectUse.ts", () => {
  let entityEffectUse: EntityEffectUse;
  let testAttacker: INPC;
  let testTarget: ICharacter;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();
    entityEffectUse = container.get<EntityEffectUse>(EntityEffectUse);
  });
  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);
    testAttacker = await unitTestHelper.createMockNPC(null, {});
    testTarget = await unitTestHelper.createMockCharacter(null, {});
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });

  it("should call EntityEffectCycle if there are EntryEffect and probability is maximum", async () => {
    const entryEffects: IEntityEffect[] = [
      {
        key: "effect",
        totalDurationMs: 100,
        intervalMs: 1000,
        value: 1,
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        effect: async (target: ICharacter | INPC) => {
          target.health = -1;
          await target.save();
        },
        probability: 100,
        targetAnimationKey: "poison",
        type: EntityAttackType.Melee,
      },
    ];

    // @ts-ignore
    const effectsSocket = jest.spyOn(entityEffectUse.effectsSocketEvents, "EntityEffect" as any);
    effectsSocket.mockImplementation(() => 1);

    await entityEffectUse.applyEntityEffects(entryEffects, testTarget, testAttacker);

    expect(effectsSocket).toHaveBeenCalled();
  });

  it("should not call EntityEffectCycle if there are EntryEffect and probability is minimum", async () => {
    const entryEffects: IEntityEffect[] = [
      {
        key: "effect",
        totalDurationMs: 100,
        intervalMs: 1000,
        value: 1,
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        effect: async (target: ICharacter | INPC) => {
          target.health = -1;
          await target.save();
        },
        probability: 0,
        targetAnimationKey: "poison",
        type: EntityAttackType.Melee,
      },
    ];

    // @ts-ignore
    const effectsSocket = jest.spyOn(entityEffectUse.effectsSocketEvents, "EntityEffect" as any);
    effectsSocket.mockImplementation(() => 1);

    await entityEffectUse.applyEntityEffects(entryEffects, testTarget, testAttacker);

    expect(effectsSocket).not.toHaveBeenCalled();
  });

  it("should not call EntityEffectCycle if there are no EntryEffect", async () => {
    const entryEffects: IEntityEffect[] = [];

    // @ts-ignore
    const effectsSocket = jest.spyOn(entityEffectUse.effectsSocketEvents, "EntityEffect" as any);
    effectsSocket.mockImplementation(() => 1);

    await entityEffectUse.applyEntityEffects(entryEffects, testTarget, testAttacker);

    expect(effectsSocket).not.toHaveBeenCalled();
  });

  it("should call EntityEffectCycle", async () => {
    const entryEffects: IEntityEffect[] = [
      {
        key: "effect",
        totalDurationMs: 100,
        intervalMs: 1000,
        value: 1,
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        effect: async (target: ICharacter | INPC) => {
          target.health = -1;
          await target.save();
        },
        probability: 100,
        targetAnimationKey: "poison",
        type: EntityAttackType.Melee,
      },
    ];

    // @ts-ignore
    const effectsSocket = jest.spyOn(entityEffectUse.effectsSocketEvents, "EntityEffect" as any);
    effectsSocket.mockImplementation(() => 1);

    await entityEffectUse.applyEntityEffects(entryEffects, testTarget, testAttacker);

    expect(effectsSocket).toHaveBeenCalled();
  });

  it("should not call EntityEffectCycle if character has effect", async () => {
    const entryEffects: IEntityEffect[] = [
      {
        key: "effect",
        totalDurationMs: 100,
        intervalMs: 1000,
        value: 1,
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        effect: async (target: ICharacter | INPC) => {
          target.health = -1;
          await target.save();
        },
        probability: 100,
        targetAnimationKey: "poison",
        type: EntityAttackType.Melee,
      },
    ];

    // @ts-ignore
    const effectsSocket = jest.spyOn(entityEffectUse.effectsSocketEvents, "EntityEffect" as any);
    effectsSocket.mockImplementation(() => 1);

    testTarget.applyEntityEffect = ["effect"];

    await entityEffectUse.applyEntityEffects(entryEffects, testTarget, testAttacker);

    expect(effectsSocket).not.toHaveBeenCalled();
  });
});
