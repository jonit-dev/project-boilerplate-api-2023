/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { ItemRarity } from "@providers/item/ItemRarity";
import { OthersBlueprint, RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { FromGridX, FromGridY, INPCLoot, ItemRarities } from "@rpg-engine/shared";
import { NPCDeath } from "../NPCDeath";
jest.mock("@providers/constants/NPCConstants", () => ({
  NPC_LOOT_CHANCE_MULTIPLIER: jest.fn(() => 1),
}));

describe("NPCDeath.ts", () => {
  let npcDeath: NPCDeath;
  let testNPC: INPC;
  let testCharacter: ICharacter;
  let itemRarity: ItemRarity;

  beforeAll(() => {
    npcDeath = container.get<NPCDeath>(NPCDeath);
    itemRarity = container.get<ItemRarity>(ItemRarity);
  });

  beforeEach(async () => {
    testNPC = await unitTestHelper.createMockNPC(null, { hasSkills: true });
    testCharacter = await unitTestHelper.createMockCharacter();

    testNPC.x = FromGridX(0);
    testNPC.y = FromGridY(0);
    await testNPC.save();

    testCharacter.x = FromGridX(1);
    testCharacter.y = FromGridY(0);
    await testCharacter.save();
  });

  it("should properly warn characters around, about NPC's death", async () => {
    // @ts-ignore
    const spyOnNearbyCharacters = jest.spyOn(npcDeath.characterView, "getCharactersAroundXYPosition");
    // @ts-ignore
    const spySocketMessaging = jest.spyOn(npcDeath.socketMessaging, "sendEventToUser");

    await npcDeath.handleNPCDeath(testNPC, testCharacter);

    expect(spyOnNearbyCharacters).toHaveBeenCalledWith(testNPC.x, testNPC.y, testNPC.scene);

    expect(spyOnNearbyCharacters).toHaveReturnedTimes(1);

    expect(spyOnNearbyCharacters).toHaveBeenCalled();

    expect(spySocketMessaging).toHaveBeenCalled();
  });

  it("on NPC death, make sure we generate a body and add nextSpawnTime to its payload", async () => {
    await npcDeath.handleNPCDeath(testNPC, testCharacter);

    const npcBody = await Item.findOne({
      owner: testCharacter._id,
      name: `${testNPC.name}'s body`,
      x: testNPC.x,
      y: testNPC.y,
      scene: testNPC.scene,
    });

    expect(npcBody).toBeDefined();

    expect(!testNPC.isAlive).toBeTruthy();

    expect(testNPC.nextSpawnTime).toBeDefined();
  });

  it("should add the correct amount of gold to the NPC's body", async () => {
    // Set NPC's max health and skills to values that will result in a specific amount of gold drop

    testNPC = await testNPC.populate("skills").execPopulate();

    testNPC.maxHealth = 100;

    await testNPC.save();

    expect(testNPC.skills).toBeDefined();

    const mockGetGoldLoot = {
      itemBlueprintKey: OthersBlueprint.GoldCoin,
      chance: 100,
      quantityRange: [4, 4],
    } as INPCLoot;

    // @ts-expect-error
    npcDeath.getGoldLoot = jest.fn().mockReturnValue(mockGetGoldLoot);

    await npcDeath.handleNPCDeath(testNPC, testCharacter);

    // Find the NPC's body
    const npcBody = await Item.findOne({
      bodyFromId: testNPC._id,
    });

    expect(npcBody).not.toBeNull();
    expect(npcBody!.itemContainer).toBeDefined();

    const bodyItemContainer = (await ItemContainer.findById(npcBody!.itemContainer)) as IItemContainer;

    expect(bodyItemContainer).not.toBeNull();

    expect(bodyItemContainer.slots).toBeDefined();

    const goldCoinItem = bodyItemContainer.slots[1];

    expect(goldCoinItem.key).toBe(OthersBlueprint.GoldCoin);

    expect(goldCoinItem.stackQty).toBe(4);
  });

  it("on NPC death, make sure loot is added to NPC body", async () => {
    // @ts-ignore
    const spyAddLootInNPCBody = jest.spyOn(npcDeath, "addLootToNPCBody");

    await npcDeath.handleNPCDeath(testNPC, testCharacter);

    expect(spyAddLootInNPCBody).toHaveBeenCalled();

    const npcBody = await Item.findOne({
      name: `${testNPC.name}'s body`,
      x: testNPC.x,
      y: testNPC.y,
      scene: testNPC.scene,
    });

    expect(npcBody).not.toBeNull();
    expect(npcBody!.itemContainer).toBeDefined();

    const bodyItemContainer = await ItemContainer.findById(npcBody!.itemContainer);

    expect(bodyItemContainer).not.toBeNull();
    expect(bodyItemContainer!.slots).toBeDefined();
    expect(bodyItemContainer!.slots[0]).not.toBeNull();
    expect(bodyItemContainer!.slots[2]).toBeNull();
  });

  it("on NPC death, make sure the rarity is setting", async () => {
    testNPC.loots = [{ itemBlueprintKey: "bow", chance: 100 }];

    await testNPC.save();

    await npcDeath.handleNPCDeath(testNPC, testCharacter);

    const bow = (await Item.findOne({ key: "bow", rarity: ItemRarities.Common })) as unknown as IItem;

    bow.rarity = ItemRarities.Legendary;
    await bow.save();

    await npcDeath.handleNPCDeath(testNPC, testCharacter);

    const newNpcBody = await Item.findOne({
      name: `${testNPC.name}'s body`,
      x: testNPC.x,
      y: testNPC.y,
      scene: testNPC.scene,
    });

    expect(newNpcBody).not.toBeNull();
    expect(newNpcBody!.itemContainer).toBeDefined();

    const bodyItemContainer = await ItemContainer.findById(newNpcBody!.itemContainer);

    expect(bodyItemContainer).not.toBeNull();
    expect(bodyItemContainer!.slots).toBeDefined();

    expect(bodyItemContainer!.slots[0]).toMatchObject({ key: "bow", rarity: ItemRarities.Common });
  });

  it("on NPC death, make sure items are added to NPC body", async () => {
    // Add some items to the NPC's loot
    testNPC.loots = [
      { itemBlueprintKey: "light-life-potion", chance: 100 },
      { itemBlueprintKey: "jacket", chance: 100 },
    ];
    await testNPC.save();

    await npcDeath.handleNPCDeath(testNPC, testCharacter);

    const npcBody = await Item.findOne({
      name: `${testNPC.name}'s body`,
      x: testNPC.x,
      y: testNPC.y,
      scene: testNPC.scene,
    });

    expect(npcBody).not.toBeNull();
    expect(npcBody!.itemContainer).toBeDefined();

    const bodyItemContainer = await ItemContainer.findById(npcBody!.itemContainer);

    expect(bodyItemContainer).not.toBeNull();
    expect(bodyItemContainer!.slots).toBeDefined();

    const slots = Object.values(bodyItemContainer!.slots) as IItem[];

    const slotKeys: string[] = [];
    for (const slot of slots) {
      if (slot) {
        slotKeys.push(slot.key);
      }
    }

    expect(slotKeys).toContain("light-life-potion");
    expect(slotKeys).toContain("jacket");
  });

  it("on NPC death no loot is added to NPC body | NPC without loots", async () => {
    // @ts-ignore
    const spyAddLootInNPCBody = jest.spyOn(npcDeath, "addLootToNPCBody");

    // remove NPC loots
    testNPC.loots = undefined;

    await npcDeath.handleNPCDeath(testNPC, testCharacter);

    expect(spyAddLootInNPCBody).toHaveBeenCalled();

    const npcBody = await Item.findOne({
      name: `${testNPC.name}'s body`,
      x: testNPC.x,
      y: testNPC.y,
      scene: testNPC.scene,
    });

    expect(npcBody).not.toBeNull();
    expect(npcBody!.itemContainer).not.toBeNull();

    const bodyItemContainer = await ItemContainer.findById(npcBody!.itemContainer);

    expect(bodyItemContainer).not.toBeNull();
    expect(bodyItemContainer!.slots).toBeDefined();
    expect(bodyItemContainer!.slots[Number(0)]).toBeNull();
  });

  it("on NPC death, make sure loot stackable items are added to NPC body", async () => {
    // @ts-ignore
    const spyAddLootInNPCBody = jest.spyOn(npcDeath, "addLootToNPCBody");

    testNPC.loots = [
      {
        itemBlueprintKey: RangedWeaponsBlueprint.Arrow,
        chance: 100,
        quantityRange: [30, 40],
      },
    ];

    const mockGetGoldLoot = {
      itemBlueprintKey: OthersBlueprint.GoldCoin,
      chance: 0,
      quantityRange: [0, 1],
    } as INPCLoot;

    // @ts-expect-error
    npcDeath.getGoldLoot = jest.fn().mockReturnValue(mockGetGoldLoot);

    await npcDeath.handleNPCDeath(testNPC, testCharacter);

    expect(spyAddLootInNPCBody).toHaveBeenCalled();

    const npcBody = await Item.findOne({
      name: `${testNPC.name}'s body`,
      x: testNPC.x,
      y: testNPC.y,
      scene: testNPC.scene,
    });

    expect(npcBody).not.toBeNull();
    expect(npcBody!.itemContainer).toBeDefined();

    const bodyItemContainer = await ItemContainer.findById(npcBody!.itemContainer);

    expect(bodyItemContainer).not.toBeNull();
    expect(bodyItemContainer!.slots).toBeDefined();
    expect(bodyItemContainer!.slots[0]).toBeDefined();
    expect(bodyItemContainer!.slots[1]).toBeNull();

    const stackableLoot = bodyItemContainer!.slots[0] as IItem;
    expect(stackableLoot.stackQty).toBeGreaterThanOrEqual(30);
    expect(stackableLoot.stackQty).toBeLessThanOrEqual(40);
  });

  it("should set the rarity 'Rare'", () => {
    // @ts-ignore
    jest.spyOn(itemRarity, "randomizeRarity").mockReturnValue(ItemRarities.Legendary);
    // @ts-ignore
    expect(itemRarity.randomizeRarity()).toBe(ItemRarities.Legendary);
  });

  it("should return value 5 for rarity 'Uncommon'", () => {
    const stats = { attack: 4, defense: 4, rarity: ItemRarities.Uncommon };
    // @ts-ignore
    expect(itemRarity.randomizeRarityBuff(stats)).toEqual({
      attack: 5,
      defense: 5,
      rarity: ItemRarities.Uncommon,
    });
  });

  it("should return value 10 for rarity 'Legendary'", () => {
    const stats = { attack: 10, defense: 10, rarity: ItemRarities.Legendary };
    // @ts-ignore
    expect(itemRarity.randomizeRarityBuff(stats)).toEqual({
      attack: 13,
      defense: 13,
      rarity: ItemRarities.Legendary,
    });
  });

  it("should set the rarity, attack and defense of an item", () => {
    const item: Partial<IItem> = { attack: 22, defense: 15, rarity: ItemRarities.Common };
    const rarity = ItemRarities.Legendary;
    // @ts-ignore
    itemRarity.randomizeRarity = jest.fn().mockReturnValue(rarity);

    const result = itemRarity.setItemRarity(item as IItem);

    expect(result).toEqual({
      attack: 28,
      defense: 19,
      rarity: rarity,
    });

    // @ts-ignore
    expect(itemRarity.randomizeRarity).toHaveBeenCalled();
  });
});
