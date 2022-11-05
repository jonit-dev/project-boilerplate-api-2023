/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { container, unitTestHelper } from "@providers/inversify/container";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { DepotNetworkOpen } from "../network/DepotNetworkOpen";
import { Depot } from "@entities/ModuleDepot/DepotModel";
import { Types } from "mongoose";
import { IItemContainer } from "@entities/ModuleInventory/ItemContainerModel";

describe("DepotNetworkOpen.ts", () => {
  let depotNetworkOpen: DepotNetworkOpen, testNPC: INPC, testCharacter: ICharacter;

  beforeAll(async () => {
    depotNetworkOpen = container.get<DepotNetworkOpen>(DepotNetworkOpen);
    await unitTestHelper.beforeAllJestHook();
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);
    testCharacter = await unitTestHelper.createMockCharacter();
    testNPC = await unitTestHelper.createMockNPC();

    testCharacter.x = 1;
    testCharacter.y = 0;
    await testCharacter.save();

    testNPC.x = 1;
    testNPC.y = 1;
    await testNPC.save();
  });

  it("character without depot | should create new empty depot", async () => {
    // @ts-ignore
    const depotContainer = await depotNetworkOpen.getDepotContainer(testCharacter.id, testNPC.id);

    expect(depotContainer).toBeDefined();
    expect(depotContainer!.slotQty).toEqual(20);

    // all quest should have status InProgress
    for (const i in depotContainer!.slots) {
      expect(depotContainer!.slots[i]).toBeNull();
    }

    const newDepot = await Depot.findOne({
      owner: Types.ObjectId(testCharacter.id),
      npc: Types.ObjectId(testNPC.id),
    })
      .populate("itemContainer")
      .exec();

    expect(newDepot).toBeDefined();
    expect(depotContainer.parentItem).toEqual(newDepot!._id);

    const newDepotContainer = newDepot!.itemContainer as unknown as IItemContainer;
    expect(newDepotContainer).toBeDefined();
    expect(depotContainer._id).toEqual(newDepotContainer._id);
    expect(depotContainer.slotQty).toEqual(newDepotContainer.slotQty);
  });

  it("character with depot | should return corresponding depot", async () => {
    // create depot container for character
    const characterDepot = await unitTestHelper.createMockDepot(testNPC.id, testCharacter.id);

    // @ts-ignore
    const depotContainer = await depotNetworkOpen.getDepotContainer(testCharacter.id, testNPC.id);

    expect(depotContainer).toBeDefined();

    expect(depotContainer.parentItem).toEqual(characterDepot!._id);
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});