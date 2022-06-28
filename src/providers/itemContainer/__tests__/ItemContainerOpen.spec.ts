/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { Item } from "@entities/ModuleInventory/ItemModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { UISocketEvents } from "@rpg-engine/shared";
import { ItemContainerOpen } from "../network/ItemContainerOpen";

describe("ItemContainerOpen.ts", () => {
  let itemContainerOpen: ItemContainerOpen;

  let testCharacter: ICharacter;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();

    itemContainerOpen = container.get<ItemContainerOpen>(ItemContainerOpen);
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);

    testCharacter = await unitTestHelper.createMockCharacter();
  });

  it("should automatically create  a container, if the item being saved is a container", async () => {
    const newContainer = await unitTestHelper.createMockItemContainer(testCharacter);

    expect(newContainer.isItemContainer).toBe(true);

    const itemContainer = await ItemContainer.findOne({
      parentItem: newContainer._id,
    });

    expect(itemContainer).toBeDefined();
  });

  it("should throw an error if item is not accessible", async () => {
    // @ts-ignore
    jest.spyOn(itemContainerOpen.socketMessaging, "sendEventToUser" as any);

    // this is an inexistent item
    await itemContainerOpen.openContainer({ itemId: "62b792030c3f470048787736" }, testCharacter);

    // @ts-ignore
    expect(itemContainerOpen.socketMessaging.sendEventToUser).toHaveBeenCalledWith(
      testCharacter.channelId!,
      UISocketEvents.ShowMessage,
      {
        message: "Sorry, this item is not accessible.",
        type: "error",
      }
    );
  });

  it("should throw an error if container is not found", async () => {
    // @ts-ignore
    jest.spyOn(itemContainerOpen.socketMessaging, "sendEventToUser" as any);

    const item = await unitTestHelper.createMockItemContainer(testCharacter);

    const itemContainer = await ItemContainer.findOne({
      parentItem: item._id,
    });

    if (itemContainer) {
      await itemContainer.remove();

      const fetchItemContainer = await ItemContainer.findOne({
        parentItem: item._id,
      });

      const fetchItem = await Item.findById(item._id);

      expect(fetchItemContainer).toBeNull();
      expect(fetchItem).toBeDefined();

      await itemContainerOpen.openContainer({ itemId: item._id }, testCharacter);

      // @ts-ignore
      expect(itemContainerOpen.socketMessaging.sendEventToUser).toHaveBeenCalledWith(
        testCharacter.channelId!,
        UISocketEvents.ShowMessage,
        {
          message: "Container not found.",
          type: "error",
        }
      );
    }
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});

// your code here
