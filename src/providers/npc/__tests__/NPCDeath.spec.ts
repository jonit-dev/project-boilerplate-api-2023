/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { Item } from "@entities/ModuleInventory/ItemModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { FromGridX, FromGridY } from "@rpg-engine/shared";
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

    testNPC = await unitTestHelper.createMockNPC();
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

    await npcDeath.handleNPCDeath(testNPC);

    expect(spyOnNearbyCharacters).toHaveBeenCalledWith(testNPC.x, testNPC.y, testNPC.scene);

    expect(spyOnNearbyCharacters).toHaveReturnedTimes(1);

    expect(spyOnNearbyCharacters).toHaveBeenCalled();

    expect(spySocketMessaging).toHaveBeenCalled();
  });

  it("on NPC death, make sure we generate a body and add nextSpawnTime to its payload", async () => {
    await npcDeath.handleNPCDeath(testNPC);

    const npcBody = await Item.findOne({
      owner: testNPC._id,
      name: `${testNPC.name}'s body`,
      x: testNPC.x,
      y: testNPC.y,
      scene: testNPC.scene,
    });

    expect(npcBody).toBeDefined();
    expect(npcBody).not.toBeNull();

    expect(!testNPC.isAlive).toBeTruthy();

    expect(testNPC.nextSpawnTime).toBeDefined();
  });

  it("on NPC death, make sure loot is added to NPC body", async () => {
    // @ts-ignore
    const spyAddLootInNPCBody = jest.spyOn(npcDeath, "addLootToNPCBody");

    await npcDeath.handleNPCDeath(testNPC);

    expect(spyAddLootInNPCBody).toHaveBeenCalled();

    const npcBody = await Item.findOne({
      owner: testNPC._id,
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
  });

  it("on NPC death, make sure many loot items are added to NPC body", async () => {
    // @ts-ignore
    const spyAddLootInNPCBody = jest.spyOn(npcDeath, "addLootToNPCBody");

    for (let i = 0; i <= 15; i++) {
      testNPC.loots?.push({ itemBlueprintKey: "jacket", chance: 50 });
    }

    await npcDeath.handleNPCDeath(testNPC);

    expect(spyAddLootInNPCBody).toHaveBeenCalled();

    const npcBody = await Item.findOne({
      owner: testNPC._id,
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
    expect(bodyItemContainer!.slots[19]).toBeNull();
    for (let i = 0; i <= 5; i++) {
      expect(bodyItemContainer!.slots[Number(i)]).not.toBeNull();
    }
  });

  it("on NPC death no loot is added to NPC body | NPC without loots", async () => {
    // @ts-ignore
    const spyAddLootInNPCBody = jest.spyOn(npcDeath, "addLootToNPCBody");

    // remove NPC loots
    testNPC.loots = undefined;

    await npcDeath.handleNPCDeath(testNPC);

    expect(spyAddLootInNPCBody).toHaveBeenCalled();

    const npcBody = await Item.findOne({
      owner: testNPC._id,
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

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});

// your code here
