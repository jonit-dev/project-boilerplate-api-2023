/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { ItemSocketEvents, ToGridX, UISocketEvents } from "@rpg-engine/shared";
import { ItemContainerOpen } from "../network/ItemContainerOpen";

describe("ItemContainerOpen.ts", () => {
  let itemContainerOpen: ItemContainerOpen;

  let testCharacter: ICharacter;
  let inventory: IItem;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();

    itemContainerOpen = container.get<ItemContainerOpen>(ItemContainerOpen);
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);

    testCharacter = await unitTestHelper.createMockCharacter(null, { hasEquipment: true, hasInventory: true });
    inventory = await testCharacter.inventory;
  });

  it("should successfully open a container", async () => {
    // @ts-ignore
    jest.spyOn(itemContainerOpen.socketMessaging, "sendEventToUser" as any);

    const inventoryItemContainer = await ItemContainer.findOne({
      parentItem: inventory.id,
    });

    if (!inventoryItemContainer) {
      throw new Error("Could not find inventory container");
    }

    await itemContainerOpen.openContainer(
      {
        itemId: inventory.id,
      },
      testCharacter
    );

    // @ts-ignore
    expect(itemContainerOpen.socketMessaging.sendEventToUser).toHaveBeenCalledWith(
      testCharacter.channelId!,
      ItemSocketEvents.ContainerRead,
      {
        itemContainer: inventoryItemContainer,
      }
    );
  });

  it("should automatically create  a container, if the item being saved is a container", async () => {
    const newContainer = await unitTestHelper.createMockItemContainer(testCharacter);

    expect(newContainer.isItemContainer).toBe(true);

    const itemContainer = await ItemContainer.findOne({
      parentItem: newContainer._id,
    });

    expect(itemContainer).toBeDefined();
  });

  describe("Validations", () => {
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

    it("should throw an error if he tries to open a container that's not his", async () => {
      // @ts-ignore
      jest.spyOn(itemContainerOpen.socketMessaging, "sendEventToUser" as any);

      const item = await unitTestHelper.createMockItemContainer(testCharacter);

      const itemContainer = await ItemContainer.findOne({
        parentItem: item._id,
      });

      if (itemContainer) {
        const otherCharacter = await unitTestHelper.createMockCharacter();

        await itemContainerOpen.openContainer({ itemId: item._id }, otherCharacter);

        // @ts-ignore
        expect(itemContainerOpen.socketMessaging.sendEventToUser).toHaveBeenCalledWith(
          otherCharacter.channelId!,
          UISocketEvents.ShowMessage,
          {
            message: "You can't open this container because it's not yours.",
            type: "error",
          }
        );
      }
    });

    it("should throw an error if the character trying to open the container is too far away", async () => {
      // @ts-ignore
      jest.spyOn(itemContainerOpen.socketMessaging, "sendEventToUser" as any);

      const item = await unitTestHelper.createMockItemContainer(testCharacter);

      testCharacter.x = ToGridX(999);
      testCharacter.y = ToGridX(999);
      await testCharacter.save();

      await itemContainerOpen.openContainer({ itemId: item._id }, testCharacter);

      // @ts-ignore
      expect(itemContainerOpen.socketMessaging.sendEventToUser).toHaveBeenCalledWith(
        testCharacter.channelId!,
        UISocketEvents.ShowMessage,
        {
          message: "Sorry, you are too far away to open this container.",
          type: "error",
        }
      );
    });

    it("should throw an error if the character trying to open the container is not online", async () => {
      // @ts-ignore
      jest.spyOn(itemContainerOpen.socketMessaging, "sendEventToUser" as any);

      const item = await unitTestHelper.createMockItemContainer(testCharacter);

      testCharacter.isOnline = false;
      await testCharacter.save();

      await itemContainerOpen.openContainer({ itemId: item._id }, testCharacter);

      // @ts-ignore
      expect(itemContainerOpen.socketMessaging.sendEventToUser).toHaveBeenCalledWith(
        testCharacter.channelId!,
        UISocketEvents.ShowMessage,
        {
          message: "Sorry, you must be online to open this container.",
          type: "error",
        }
      );
    });

    it("should throw an error if the character trying to open a container is banned", async () => {
      // @ts-ignore
      jest.spyOn(itemContainerOpen.socketMessaging, "sendEventToUser" as any);

      const item = await unitTestHelper.createMockItemContainer(testCharacter);

      testCharacter.isBanned = true;
      await testCharacter.save();

      await itemContainerOpen.openContainer({ itemId: item._id }, testCharacter);

      // @ts-ignore
      expect(itemContainerOpen.socketMessaging.sendEventToUser).toHaveBeenCalledWith(
        testCharacter.channelId!,
        UISocketEvents.ShowMessage,
        {
          message: "Sorry, you are banned and can't open this container.",
          type: "error",
        }
      );
    });
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});

// your code here
