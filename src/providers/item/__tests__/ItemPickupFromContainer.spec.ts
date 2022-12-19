/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { CharacterItemSlots } from "@providers/character/characterItems/CharacterItemSlots";
import { container, unitTestHelper } from "@providers/inversify/container";
import { IItemPickup } from "@rpg-engine/shared";
import { ObjectId } from "mongodb";
import { ItemPickupFromContainer } from "../ItemPickup/ItemPickupFromContainer";

// jest.mock("@entities/ModuleInventory/ItemContainerModel");
// jest.mock("@providers/character/characterItems/CharacterItemSlots");

describe("ItemPickupFromContainer.ts ", () => {
  let itemPickupFromContainer: ItemPickupFromContainer;
  let itemPickupData: IItemPickup;
  let itemToBePicked: IItem;
  let character: ICharacter;
  let characterItemSlots: CharacterItemSlots;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();

    itemPickupFromContainer = container.get<ItemPickupFromContainer>(ItemPickupFromContainer);
  });
  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);

    character = await unitTestHelper.createMockCharacter(null, {});
  });
  afterEach(() => {
    // Create a mock function for the clearAllMocks function
    jest.clearAllMocks();
  });
  afterAll(async () => {
    // Create a mock function for the afterAllJestHook function
    await unitTestHelper.afterAllJestHook();
  });

  it("should return false if the fromContainer is not found", async () => {
    // @ts-ignore
    jest.mocked(ItemPickupFromContainer.socketMessaging, "sendErrorMessageToCharacter" as any);

    // Test case with fromContainerId that does not match any existing ItemContainer in the database.
    itemPickupData = {
      itemId: "123",
      x: 10,
      y: 10,
      scene: "scene",
      toContainerId: "toContainerId",
      fromContainerId: "fromContainerId",
    };

    // Test case with fromContainerId that matches a deleted ItemContainer in the database.
    const objectId: ObjectId = new ObjectId();
    const deletedItemContainer = new ItemContainer({ name: "Deleted Container", parentItem: objectId });
    await deletedItemContainer.save();
    itemPickupData.fromContainerId = deletedItemContainer._id;
    await deletedItemContainer.remove();

    const result2 = await itemPickupFromContainer.pickupFromContainer(itemPickupData, itemToBePicked, character);
    expect(result2).toBe(false);

    // Test case with fromContainerId that is not provided in the itemPickupData object.
    delete itemPickupData.fromContainerId;
    const result3 = await itemPickupFromContainer.pickupFromContainer(itemPickupData, itemToBePicked, character);
    expect(result3).toBe(false);
  });
});
