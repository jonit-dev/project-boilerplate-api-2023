import { container, unitTestHelper } from "@providers/inversify/container";
import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { UISocketEvents } from "@rpg-engine/shared";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { ItemValidation } from "../validation/ItemValidation";

describe("ItemValidation.ts", () => {
  let itemValidation: ItemValidation;
  let testCharacter: ICharacter;
  let testItem1: IItem;
  let testItem2: IItem;
  let inventory: IItem;
  let inventoryItemContainerId: string;
  let sendEventToUser: jest.SpyInstance;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();

    itemValidation = container.get<ItemValidation>(ItemValidation);
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);

    testCharacter = await (
      await unitTestHelper.createMockCharacter(null, { hasEquipment: true, hasInventory: true, hasSkills: true })
    )
      .populate("skills")
      .execPopulate();

    testItem1 = await unitTestHelper.createMockItem();
    testItem2 = await unitTestHelper.createMockItem();

    inventory = await testCharacter.inventory;
    inventoryItemContainerId = inventory.itemContainer as unknown as string;

    await addItemToInventory(testItem1);

    await testCharacter.save();

    sendEventToUser = jest.spyOn(SocketMessaging.prototype, "sendEventToUser");
  });

  afterEach(() => {
    sendEventToUser.mockRestore();
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });

  const addItemToInventory = async (item: IItem): Promise<IItem> => {
    const bag = await getInventoryContainer();
    if (bag) {
      bag.slots[0] = item;
      await ItemContainer.updateOne(
        {
          _id: bag.id,
        },
        {
          $set: {
            slots: bag.slots,
          },
        }
      );
    }
    return item;
  };

  const getInventoryContainer = async (): Promise<IItemContainer> => {
    return (await ItemContainer.findById(inventoryItemContainerId)) as unknown as IItemContainer;
  };

  it("should have item in character inventory", async () => {
    const result = await itemValidation.isItemInCharacterInventory(testCharacter, testItem1.id);
    expect(result).toBeTruthy();
    expect(sendEventToUser).toHaveBeenCalledTimes(0);
  });

  it("should not have item in character inventory", async () => {
    const result = await itemValidation.isItemInCharacterInventory(testCharacter, testItem2.id);
    expect(result).toBeFalsy();
    expect(sendEventToUser).toHaveBeenCalledTimes(1);
    expect(sendEventToUser).toHaveBeenLastCalledWith(testCharacter.channelId, UISocketEvents.ShowMessage, {
      message: "Sorry, you do not have this item in your inventory.",
      type: "error",
    });
  });
});
