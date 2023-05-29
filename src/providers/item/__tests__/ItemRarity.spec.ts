import { IItem } from "@entities/ModuleInventory/ItemModel";
import { container } from "@providers/inversify/container";
import { TraitGetter } from "@providers/skill/TraitGetter";
import { ItemRarities } from "@rpg-engine/shared";
import _ from "lodash";
import { ItemRarity } from "../ItemRarity";

describe("ItemRarity", () => {
  let itemRarity: ItemRarity;
  const mockItem = {
    attack: 10,
    defense: 10,
    rarity: ItemRarities.Common,
  } as IItem;

  beforeAll(() => {
    itemRarity = container.get(ItemRarity);
  });

  describe("setItemRarityOnLootDrop", () => {
    it("should assign rarity to a loot item", () => {
      const result = itemRarity.setItemRarityOnLootDrop(mockItem);
      expect(result.rarity).toBeDefined();
    });

    it("should calculate attack and defense based on rarity", () => {
      const result = itemRarity.setItemRarityOnLootDrop(mockItem);
      expect(result.attack).toBeDefined();
      expect(result.defense).toBeDefined();
    });
  });

  describe("setItemRarityOnCraft", () => {
    // Mock ObjectId - replace this with a valid ObjectId as per your database.
    const mockSkillId = "60bd68e8e7f23824c4de76bb";

    it("should assign rarity to a crafted item", async () => {
      const result = await itemRarity.setItemRarityOnCraft(mockItem, mockSkillId);
      expect(result.rarity).toBeDefined();
    });

    it("should calculate attack and defense based on rarity and skill", async () => {
      const result = await itemRarity.setItemRarityOnCraft(mockItem, mockSkillId);
      expect(result.attack).toBeDefined();
      expect(result.defense).toBeDefined();
    });

    jest.mock("@providers/skill/TraitGetter", () => {
      return jest.fn().mockImplementation(() => {
        return { getSkillLevelWithBuffs: jest.fn() };
      });
    });

    describe("ItemRarity", () => {
      let itemRarity: ItemRarity;
      let traitGetter: TraitGetter;
      let randomSpy: jest.SpyInstance;

      beforeEach(() => {
        traitGetter = {
          getSkillLevelWithBuffs: jest.fn(),
        } as any;
        itemRarity = new ItemRarity(traitGetter);
        randomSpy = jest.spyOn(_, "random");
      });

      afterEach(() => {
        randomSpy.mockRestore();
      });

      it("should return higher rarity with higher proficiency", async () => {
        randomSpy.mockReturnValue(89); // Set return value of _.random() to simulate Common rarity
        (traitGetter.getSkillLevelWithBuffs as jest.Mock).mockResolvedValueOnce(1);
        // @ts-ignore
        const rarityLowProficiency = await itemRarity.randomizeRarity(true, 1);
        expect(rarityLowProficiency).toEqual(ItemRarities.Common);

        randomSpy.mockReturnValue(98); // Set return value of _.random() to simulate higher rarity
        (traitGetter.getSkillLevelWithBuffs as jest.Mock).mockResolvedValueOnce(10);
        // @ts-ignore
        const rarityHighProficiency = await itemRarity.randomizeRarity(true, 10);
        expect(rarityHighProficiency).not.toEqual(ItemRarities.Common);
      });
    });
  });
});
