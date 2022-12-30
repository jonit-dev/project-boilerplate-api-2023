/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { OthersBlueprint, RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { FromGridX, FromGridY, INPCLoot } from "@rpg-engine/shared";
import { NPCDeath } from "../NPCDeath";

describe("NPCDeath.ts", () => {
  let npcDeath: NPCDeath;
  let testNPC: INPC;
  let testCharacter: ICharacter;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();

    npcDeath = container.get<NPCDeath>(NPCDeath);
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);

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
      // owner: testCharacter._id,
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

  it("on NPC death, make sure items are added to NPC body", async () => {
    // Add some items to the NPC's loot
    testNPC.loots = [
      { itemBlueprintKey: "light-life-potion", chance: 100 },
      { itemBlueprintKey: "jacket", chance: 100 },
    ];

    await npcDeath.handleNPCDeath(testNPC, testCharacter);

    const npcBody = await Item.findOne({
      // owner: testCharacter._id,
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

    // Check that the NPC's body contains the items that were added to its loot
    expect(bodyItemContainer!.slots[0]).toMatchObject({ key: "light-life-potion" });
    expect(bodyItemContainer!.slots[1]).toMatchObject({ key: "jacket" });
  });

  it("on NPC death no loot is added to NPC body | NPC without loots", async () => {
    // @ts-ignore
    const spyAddLootInNPCBody = jest.spyOn(npcDeath, "addLootToNPCBody");

    // remove NPC loots
    testNPC.loots = undefined;

    await npcDeath.handleNPCDeath(testNPC, testCharacter);

    expect(spyAddLootInNPCBody).toHaveBeenCalled();

    const npcBody = await Item.findOne({
      // owner: testCharacter._id,
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
      // owner: testCharacter._id,
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

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
