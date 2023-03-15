import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Depot } from "@entities/ModuleDepot/DepotModel";
import { IItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { Types } from "mongoose";
import { OpenDepot } from "../OpenDepot";

describe("OpenDepot.ts", () => {
  let openDepot: OpenDepot, testNPC: INPC, testCharacter: ICharacter;

  beforeAll(() => {
    openDepot = container.get<OpenDepot>(OpenDepot);
  });

  beforeEach(async () => {
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
    const depotContainer = await openDepot.getContainer(testCharacter.id, testNPC.id);

    expect(depotContainer).toBeDefined();
    expect(depotContainer!.slotQty).toEqual(40);

    // all container slots should be empty
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

    const depotContainer = await openDepot.getContainer(testCharacter.id, testNPC.id);

    expect(depotContainer).toBeDefined();

    expect(depotContainer.parentItem).toEqual(characterDepot!._id);
  });

  it("When a Character is deleted, should remove the Depot", async () => {
    const depotContainer = await openDepot.getContainer(testCharacter.id, testNPC.id);

    expect(depotContainer).toBeDefined();
    expect(depotContainer!.slotQty).toEqual(40);

    const newDepot = await Depot.findOne({
      owner: Types.ObjectId(testCharacter.id),
      npc: Types.ObjectId(testNPC.id),
    })
      .populate("itemContainer")
      .exec();

    expect(newDepot).toBeDefined();
    expect(depotContainer.parentItem).toEqual(newDepot!._id);

    const result = await testCharacter
      .remove()
      .then((res) => {
        return true;
      })
      .catch(() => {
        return false;
      });

    expect(result).toBeTruthy();

    const depotAfterDelete = await Depot.findOne({
      owner: Types.ObjectId(testCharacter.id),
      npc: Types.ObjectId(testNPC.id),
    });

    expect(depotAfterDelete).toBeNull();
  });
});
