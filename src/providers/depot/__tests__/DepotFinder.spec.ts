import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IDepot } from "@entities/ModuleDepot/DepotModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { DepotFinder } from "../DepotFinder";

describe("DepotFinder.spec.ts", () => {
  let depotFinder: DepotFinder;
  let testCharacter: ICharacter;
  let testNPC: INPC;
  let testDepot: IDepot;
  let fullDepot: IDepot;

  beforeAll(() => {
    depotFinder = container.get(DepotFinder);
  });

  beforeEach(async () => {
    testNPC = await unitTestHelper.createMockNPC({
      hasDepot: true,
    });
    testCharacter = await unitTestHelper.createMockCharacter(null, { hasEquipment: true, hasInventory: true });

    testDepot = await unitTestHelper.createMockDepot(testNPC, testCharacter._id);

    fullDepot = await unitTestHelper.createMockDepot(testNPC, testCharacter._id);

    const fullSlots = {
      0: "something",
      1: "something",
      2: "something",
    };

    await ItemContainer.updateOne(
      {
        _id: fullDepot.itemContainer,
      },
      {
        $set: {
          slots: fullSlots,
        },
      }
    );
  });

  it("should find an empty depot", async () => {
    const emptyDepot = await depotFinder.findDepotWithSlots(testCharacter);

    expect(emptyDepot).toMatchObject({
      _id: testDepot._id,
    });
  });
});
