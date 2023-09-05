/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { Item } from "@entities/ModuleInventory/ItemModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { entityEffectsBlueprintsIndex } from "@providers/entityEffects/data";
import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import { container, unitTestHelper } from "@providers/inversify/container";
import { itemsBlueprintIndex } from "@providers/item/data";
import {
  CraftingResourcesBlueprint,
  FoodsBlueprint,
  OthersBlueprint,
  SwordsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { FromGridX, FromGridY, IItem } from "@rpg-engine/shared";
import _ from "lodash";
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
    testNPC.loots = [];
    await testNPC.save();

    testCharacter.x = FromGridX(1);
    testCharacter.y = FromGridY(0);
    await testCharacter.save();
  });

  afterEach(() => {
    jest.clearAllMocks();
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

  it("on NPC death, make sure loot stackable items are added to NPC body", async () => {
    // @ts-ignore
    jest.spyOn(npcDeath.characterView, "getCharactersAroundXYPosition").mockReturnValueOnce([]);

    testNPC.loots = [
      {
        itemBlueprintKey: CraftingResourcesBlueprint.Bones,
        chance: 100,
        // @ts-ignore
        quantityRange: [30, 40],
      },
    ];

    await npcDeath.handleNPCDeath(testNPC);

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

    // Add some items to the NPC's loot
    // @ts-ignore
    testNPC.loots = [
      // @ts-ignore
      { itemBlueprintKey: CraftingResourcesBlueprint.Diamond, chance: 100, quantityRange: [1, 2] },
      // @ts-ignore
      { itemBlueprintKey: CraftingResourcesBlueprint.GoldenIngot, chance: 100, quantityRange: [1, 2] },
    ];

    await npcDeath.handleNPCDeath(testNPC);

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

    await npcDeath.handleNPCDeath(testNPC);

    const npcBody = await Item.findOne({
      owner: testCharacter._id,
      name: `${testNPC.name}'s body`,
      x: testNPC.x,
      y: testNPC.y,
      scene: testNPC.scene,
    });

    expect(npcBody).toBeDefined();

    testNPC = (await NPC.findById(testNPC._id)) as INPC;

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

    await testNPC.save();

    // @ts-ignore
    const SpyOnGetGoldLoot = jest.spyOn(npcDeath.npcLoot, "getGoldLoot");

    await npcDeath.handleNPCDeath(testNPC);

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
    const spyAddLootInNPCBody = jest.spyOn(npcDeath.npcLoot, "addLootToNPCBody");

    await npcDeath.handleNPCDeath(testNPC);

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

  it("on NPC death no loot is added to NPC body if NPC has no loot", async () => {
    // @ts-ignore
    jest.spyOn(npcDeath.characterView, "getCharactersAroundXYPosition").mockReturnValueOnce([]);
    // @ts-ignore
    const spyAddLootInNPCBody = jest.spyOn(npcDeath.npcLoot, "addLootToNPCBody");

    // @ts-ignore
    jest.spyOn(npcDeath.npcLoot, "getGoldLoot").mockReturnValueOnce([]);

    // remove NPC loots
    testNPC.loots = [];

    await testNPC.save();

    await npcDeath.handleNPCDeath(testNPC);

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

  //! Flaky test - temporarily suspended
  // it("should not add loot to NPC body if loot chance is not met", async () => {
  //   // @ts-ignore
  //   jest.spyOn(npcDeath, "getGoldLoot").mockReturnValueOnce([]);
  //   // @ts-ignore
  //   jest.spyOn(npcDeath.characterView, "getCharactersAroundXYPosition").mockReturnValueOnce([]);

  //   testNPC.loots = [
  //     // @ts-ignore
  //     { itemBlueprintKey: CraftingResourcesBlueprint.Diamond, chance: 0, quantityRange: [1, 1] },
  //   ];

  //   await npcDeath.handleNPCDeath(testNPC);

  //   const npcBody = await Item.findOne({
  //     name: `${testNPC.name}'s body`,
  //     x: testNPC.x,
  //     y: testNPC.y,
  //     scene: testNPC.scene,
  //   });

  //   expect(npcBody).not.toBeNull();
  //   expect(npcBody!.itemContainer).toBeDefined();

  //   const bodyItemContainer = await ItemContainer.findById(npcBody!.itemContainer);

  //   expect(bodyItemContainer).not.toBeNull();
  //   expect(bodyItemContainer!.slots).toBeDefined();
  //   expect(bodyItemContainer!.slots[0]).toBeNull();
  // });

  it("should stop adding loot to NPC body when all slots are full", async () => {
    // @ts-ignore
    jest.spyOn(npcDeath.characterView, "getCharactersAroundXYPosition").mockReturnValueOnce([]);

    testNPC.loots = [
      // @ts-ignore
      { itemBlueprintKey: CraftingResourcesBlueprint.Diamond, chance: 100, quantityRange: [1, 1] },
      // @ts-ignore
      { itemBlueprintKey: CraftingResourcesBlueprint.GoldenIngot, chance: 100, quantityRange: [1, 1] },
      // @ts-ignore
      { itemBlueprintKey: CraftingResourcesBlueprint.SilverIngot, chance: 100, quantityRange: [1, 1] },
    ];

    // npc body automatically creates the itemContainer

    const blueprintData = itemsBlueprintIndex["npc-body"];
    const npcBody = new Item({
      ...blueprintData, // base body props
      key: `${testNPC.key}-body`,
      bodyFromId: testNPC.id,
      texturePath: `${testNPC.textureKey}/death/0.png`,
      textureKey: testNPC.textureKey,
      name: `${testNPC.name}'s body`,
      description: `You see ${testNPC.name}'s body.`,
      scene: testNPC.scene,
      x: testNPC.x,
      y: testNPC.y,
    });

    npcBody.generateContainerSlots = 2;

    await npcBody.save();

    const npcBodyContainer = await ItemContainer.findById(npcBody.itemContainer);

    if (!npcBodyContainer) {
      throw new Error("NPC body container not found");
    }

    // @ts-ignore
    const spyAddLootInNPCBody = jest.spyOn(npcDeath.npcLoot, "addLootToNPCBody");

    // @ts-ignore
    await npcDeath.npcLoot.addLootToNPCBody(npcBody, testNPC.loots);

    expect(spyAddLootInNPCBody).toHaveBeenCalled();

    const bodyItemContainer = await ItemContainer.findById(npcBody.itemContainer);

    expect(bodyItemContainer).not.toBeNull();
    expect(bodyItemContainer!.slots).toBeDefined();
    expect(bodyItemContainer!.slots[0]).toBeDefined();
    expect(bodyItemContainer!.slots[1]).toBeDefined();
    expect(bodyItemContainer!.slots[2]).toBeUndefined();
  });

  it("should update NPC data after death", async () => {
    const poisonEntityEffect = entityEffectsBlueprintsIndex[EntityEffectBlueprint.Poison];

    testNPC.appliedEntityEffects = [poisonEntityEffect];

    await testNPC.save();

    await npcDeath.handleNPCDeath(testNPC);

    const updatedNPC = await NPC.findById(testNPC.id);

    if (!updatedNPC) throw new Error("NPC not found");

    expect(updatedNPC).not.toBeNull();
    expect(updatedNPC.health).toBe(0);
    expect(updatedNPC.nextSpawnTime).toBeDefined();
    expect(updatedNPC.currentMovementType).toBe(updatedNPC!.originalMovementType);
    expect(updatedNPC.appliedEntityEffects).toBeNull();
  });

  it("should add isDeadBodyLootable flag to NPC body on loot drop", async () => {
    // @ts-ignore
    jest.spyOn(npcDeath.characterView, "getCharactersAroundXYPosition").mockReturnValueOnce([]);

    testNPC.loots = [
      // @ts-ignore
      { itemBlueprintKey: CraftingResourcesBlueprint.Diamond, chance: 100, quantityRange: [1, 1] },
    ];

    // npc body automatically creates the itemContainer

    const blueprintData = itemsBlueprintIndex["npc-body"];
    const npcBody = new Item({
      ...blueprintData, // base body props
      key: `${testNPC.key}-body`,
      bodyFromId: testNPC.id,
      texturePath: `${testNPC.textureKey}/death/0.png`,
      textureKey: testNPC.textureKey,
      name: `${testNPC.name}'s body`,
      description: `You see ${testNPC.name}'s body.`,
      scene: testNPC.scene,
      x: testNPC.x,
      y: testNPC.y,
    });

    npcBody.generateContainerSlots = 2;

    await npcBody.save();

    // @ts-ignore
    const spyAddLootInNPCBody = jest.spyOn(npcDeath.npcLoot, "addLootToNPCBody");

    // @ts-ignore
    await npcDeath.npcLoot.addLootToNPCBody(npcBody, testNPC.loots);

    expect(spyAddLootInNPCBody).toHaveBeenCalled();

    const npcBodyUpdated = await Item.findById(npcBody.id);

    expect(npcBodyUpdated?.isDeadBodyLootable).toBe(true);
  });

  describe("Rarity tests", () => {
    beforeEach(async () => {
      testNPC = await unitTestHelper.createMockNPC(null, { hasSkills: true });
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should call setItemRarityOnLootDrop if the loot item has attack and defense", async () => {
      // @ts-ignore
      jest.spyOn(npcDeath.characterView, "getCharactersAroundXYPosition").mockReturnValueOnce([]);

      testNPC.loots = [
        // @ts-ignore
        { itemBlueprintKey: SwordsBlueprint.Sword, chance: 100, quantityRange: [1, 1] },
      ];

      await testNPC.save();

      // @ts-ignore
      const spyOnSetItemRarityOnLootDrop = jest.spyOn(npcDeath.npcLoot.itemRarity, "setItemRarityOnLootDrop");

      await npcDeath.handleNPCDeath(testNPC);

      expect(spyOnSetItemRarityOnLootDrop).toHaveBeenCalled();
    });

    it("should call setItemRarityOnLootDropForFood if the loot item is food", async () => {
      // @ts-ignore
      jest.spyOn(npcDeath.npcLoot, "getGoldLoot").mockReturnValueOnce({} as any);

      jest.spyOn(_, "random").mockImplementation(() => 1);

      // @ts-ignore
      jest.spyOn(npcDeath.characterView, "getCharactersAroundXYPosition").mockReturnValueOnce([]);

      testNPC.loots = [
        // @ts-ignore
        { itemBlueprintKey: FoodsBlueprint.Apple, chance: 100, quantityRange: [1, 1] },
      ];

      await testNPC.save();

      const spyOnSetItemRarityOnLootDropForFood = jest.spyOn(
        // @ts-ignore
        npcDeath.npcLoot.itemRarity,
        "setItemRarityOnLootDropForFood"
      );

      await npcDeath.handleNPCDeath(testNPC);

      expect(spyOnSetItemRarityOnLootDropForFood).toHaveBeenCalled();
    });
  });

  //! Flaky test - temporarily suspended
  // it("should not add isDeadBodyLootable flag to NPC body if no loot is dropped", async () => {
  //   // @ts-ignore
  //   jest.spyOn(npcDeath.characterView, "getCharactersAroundXYPosition").mockReturnValueOnce([]);

  //   testNPC.loots = [
  //     // @ts-ignore
  //     { itemBlueprintKey: CraftingResourcesBlueprint.Diamond, chance: 0, quantityRange: [1, 1] },
  //   ];

  //   // npc body automatically creates the itemContainer

  //   const blueprintData = itemsBlueprintIndex["npc-body"];
  //   const npcBody = new Item({
  //     ...blueprintData, // base body props
  //     key: `${testNPC.key}-body`,
  //     bodyFromId: testNPC.id,
  //     texturePath: `${testNPC.textureKey}/death/0.png`,
  //     textureKey: testNPC.textureKey,
  //     name: `${testNPC.name}'s body`,
  //     description: `You see ${testNPC.name}'s body.`,
  //     scene: testNPC.scene,
  //     x: testNPC.x,
  //     y: testNPC.y,
  //   });

  //   npcBody.generateContainerSlots = 2;

  //   await npcBody.save();

  //   // @ts-ignore
  //   const spyAddLootInNPCBody = jest.spyOn(npcDeath, "addLootToNPCBody");

  //   // @ts-ignore
  //   await npcDeath.npcLoot.addLootToNPCBody(npcBody, testNPC.loots);

  //   expect(spyAddLootInNPCBody).toHaveBeenCalled();

  //   const npcBodyUpdated = await Item.findById(npcBody.id);

  //   expect(npcBodyUpdated?.isDeadBodyLootable).toBe(false);
  // });
});
