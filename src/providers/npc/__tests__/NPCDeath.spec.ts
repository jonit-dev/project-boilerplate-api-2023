/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { CraftingResourcesBlueprint, OthersBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { FromGridX, FromGridY } from "@rpg-engine/shared";
import { NPCDeath } from "../NPCDeath";

describe("NPCDeath.ts", () => {
  let npcDeath: NPCDeath;
  let testNPC: INPC;
  let testCharacter: ICharacter;

  beforeAll(() => {
    npcDeath = container.get<NPCDeath>(NPCDeath);
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

  it("on NPC death, make sure loot stackable items are added to NPC body", async () => {
    // @ts-ignore
    jest.spyOn(npcDeath.characterView, "getCharactersAroundXYPosition").mockReturnValueOnce([]);
    // remove NPC loots
    testNPC.loots = undefined;

    testNPC.loots = [
      {
        itemBlueprintKey: CraftingResourcesBlueprint.Bones,
        chance: 100,
        // @ts-ignore
        quantityRange: [30, 40],
      },
    ];

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
    expect(bodyItemContainer!.slots[0]).toBeDefined();

    const stackableLoot = bodyItemContainer!.slots[0] as IItem;
    expect(stackableLoot.stackQty).toBeGreaterThanOrEqual(30);
    expect(stackableLoot.stackQty).toBeLessThanOrEqual(40);
  });

  it("on NPC death, make sure items are added to NPC body", async () => {
    // @ts-ignore
    jest.spyOn(npcDeath.characterView, "getCharactersAroundXYPosition").mockReturnValueOnce([]);

    testNPC.loots = undefined;

    // Add some items to the NPC's loot
    // @ts-ignore
    testNPC.loots = [
      // @ts-ignore
      { itemBlueprintKey: CraftingResourcesBlueprint.Diamond, chance: 100, quantityRange: [1, 2] },
      // @ts-ignore
      { itemBlueprintKey: CraftingResourcesBlueprint.GoldenIngot, chance: 100, quantityRange: [1, 2] },
    ];

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

    // Check that the NPC's body contains the items that were added to its loot
    expect(bodyItemContainer!.slots[0]).toMatchObject({ key: CraftingResourcesBlueprint.Diamond });
    expect(bodyItemContainer!.slots[1]).toMatchObject({ key: CraftingResourcesBlueprint.GoldenIngot });
  });

  it("on NPC death, make sure we generate a body and add nextSpawnTime to its payload", async () => {
    // @ts-ignore
    jest.spyOn(npcDeath.characterView, "getCharactersAroundXYPosition").mockReturnValueOnce([]);

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

  it("should execute getGoldLoot", async () => {
    // @ts-ignore
    jest.spyOn(npcDeath.characterView, "getCharactersAroundXYPosition").mockReturnValueOnce([]);

    testNPC.loots = [
      // @ts-ignore
      { itemBlueprintKey: OthersBlueprint.GoldCoin, chance: 100, quantityRange: [4, 4] },
    ];

    // @ts-ignore
    const SpyOnGetGoldLoot = jest.spyOn(npcDeath, "getGoldLoot");

    await npcDeath.handleNPCDeath(testNPC, testCharacter);

    // Find the NPC's body
    const npcBody = await Item.findOne({
      bodyFromId: testNPC._id,
    });

    expect(npcBody).not.toBeNull();
    expect(npcBody!.itemContainer).toBeDefined();

    const bodyItemContainer = (await ItemContainer.findById(npcBody!.itemContainer)) as IItemContainer;

    expect(bodyItemContainer).not.toBeNull();

    expect(SpyOnGetGoldLoot).toHaveBeenCalled();
  });

  it("on NPC death, make sure loot is added to NPC body", async () => {
    // @ts-ignore
    jest.spyOn(npcDeath.characterView, "getCharactersAroundXYPosition").mockReturnValueOnce([]);
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
  });

  it("on NPC death no loot is added to NPC body | NPC without loots", async () => {
    // @ts-ignore
    jest.spyOn(npcDeath.characterView, "getCharactersAroundXYPosition").mockReturnValueOnce([]);
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

  afterAll(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });
});
