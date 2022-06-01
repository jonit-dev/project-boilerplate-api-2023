import { Item } from "@entities/ModuleInventory/ItemModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { BattleEffects } from "../BattleEffects";

describe("BattleEffects.spec.ts", () => {
  let battleEffects: BattleEffects;

  let testNPC: INPC;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();
    battleEffects = container.get<BattleEffects>(BattleEffects);
    testNPC = await unitTestHelper.createMockNPC();
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);
  });

  it("should properly generate blood on the ground", async () => {
    await battleEffects.generateBloodOnGround(testNPC);

    const hasBlood = await Item.findOne({
      $or: [{ texturePath: "red-blood-1.png" }, { texturePath: "red-blood-2.png" }, { texturePath: "red-blood-3.png" }],
      x: testNPC.x,
      y: testNPC.y,
      scene: testNPC.scene,
      name: `${testNPC.name}'s blood`,
    });

    expect(hasBlood).toBeTruthy();
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});

// your code here
