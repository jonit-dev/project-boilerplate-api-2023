import { INPC } from "@entities/ModuleNPC/NPCModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import {
  CraftingResourcesBlueprint,
  FoodsBlueprint,
  RangedWeaponsBlueprint,
  SwordsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import _ from "lodash";
import { NPCLoot } from "../NPCLoot";

describe("NPCLoot.spec.ts", () => {
  let npcLoot: NPCLoot;
  let npc: INPC;

  beforeAll(() => {
    npcLoot = container.get(NPCLoot);
  });

  beforeEach(async () => {
    npc = await unitTestHelper.createMockNPC(null, { hasSkills: true });
  });

  it("properly calculates the gold that's going to be dropped", () => {
    // mock lodash random
    jest.spyOn(_, "random").mockReturnValue(10);

    const goldLoot = npcLoot.getGoldLoot(npc);

    expect(goldLoot).toMatchObject({
      quantityRange: [1, 8],
    });
  });

  it("calculates loot chance correctly", async () => {
    const loot = {
      chance: 50,
      itemBlueprintKey: RangedWeaponsBlueprint.Arrow,
      quantityRange: [1, 10],
    };
    // @ts-ignore
    const chance = await npcLoot.calculateLootChance(loot);
    expect(chance).toBeGreaterThanOrEqual(0);
  });

  it("calculates loot quantity correctly", () => {
    const loot = {
      chance: 50,
      itemBlueprintKey: RangedWeaponsBlueprint.Arrow,
      quantityRange: [1, 10],
    };
    // @ts-ignore
    const lootQuantity = npcLoot.getLootQuantity(loot);
    expect(lootQuantity).toBeGreaterThanOrEqual(1);
    expect(lootQuantity).toBeLessThanOrEqual(10);
  });

  describe("Loot multipliers", () => {
    it("properly calculates the loot multiplier for crafting resources", async () => {
      const craftItem = await unitTestHelper.createMockItemFromBlueprint(CraftingResourcesBlueprint.Wheat);

      // @ts-ignore
      const result = await npcLoot.getLootMultiplier(craftItem);

      expect(result).toBe(1);
    });

    it("calculates the loot multiplier for food", async () => {
      const foodItem = await unitTestHelper.createMockItemFromBlueprint(FoodsBlueprint.Apple);

      // @ts-ignore
      const result = await npcLoot.getLootMultiplier(foodItem);

      expect(result).toBe(0.5);
    });

    it("returns the default NPC_LOOT_CHANCE_MULTIPLIER for regular items", async () => {
      const sword = await unitTestHelper.createMockItemFromBlueprint(SwordsBlueprint.Sword);

      // @ts-ignore
      const result = await npcLoot.getLootMultiplier(sword);

      expect(result).toBe(1);
    });
  });
});
