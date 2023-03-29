import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment } from "@entities/ModuleCharacter/EquipmentModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { BodiesBlueprint, OthersBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { itemMock } from "@providers/unitTests/mock/itemMock";
import { FromGridX, FromGridY, IItemPickup } from "@rpg-engine/shared";
import { Types } from "mongoose";
import { ItemPickupValidator } from "../ItemPickupValidator";

describe("ItemPickupValidator.ts", () => {
  let testCharacter: ICharacter;
  let testItem: IItem;
  let inventory: IItem;
  let sendErrorMessageToCharacter: jest.SpyInstance;
  let inventoryItemContainerId: string;

  let itemPickupValidator: ItemPickupValidator;

  beforeAll(() => {
    itemPickupValidator = container.get<ItemPickupValidator>(ItemPickupValidator);

    // @ts-ignore
    sendErrorMessageToCharacter = jest.spyOn(itemPickupValidator.socketMessaging, "sendErrorMessageToCharacter" as any);
  });

  beforeEach(async () => {
    testCharacter = await await unitTestHelper.createMockCharacter(null, {
      hasEquipment: true,
      hasInventory: true,
      hasSkills: true,
    });
    testItem = await unitTestHelper.createMockItem();
    inventory = await testCharacter.inventory;
    inventoryItemContainerId = inventory.itemContainer as unknown as string;

    testCharacter.x = FromGridX(1);
    testCharacter.y = FromGridY(0);
    await testCharacter.save();
    await testItem.save();
  });

  const generatePickupData = (props?: Partial<IItemPickup>): IItemPickup => {
    return {
      itemId: testItem._id,
      x: FromGridX(0),
      y: FromGridY(0),
      scene: "example",
      toContainerId: inventoryItemContainerId,
      ...props,
    };
  };

  it("should throw an error if container is not accessible", async () => {
    const pickupValid = await itemPickupValidator.isItemPickupValid(
      generatePickupData({
        itemId: "62b792030c3f470048781135",
      }),
      testCharacter
    );

    expect(pickupValid).toBeFalsy();

    expect(sendErrorMessageToCharacter).toHaveBeenCalledWith(
      testCharacter,
      "Sorry, the item to be picked up was not found."
    );
  });

  it("should throw an error if you try to pickup an item that is not storable", async () => {
    const notStorableItem = new Item({
      ...itemMock,
      isStorable: false,
    });
    await notStorableItem.save();

    const pickupValid = await itemPickupValidator.isItemPickupValid(
      generatePickupData({
        itemId: notStorableItem._id,
      }),
      testCharacter
    );

    expect(pickupValid).toBeFalsy();

    expect(sendErrorMessageToCharacter).toHaveBeenCalledWith(testCharacter, "Sorry, you cannot store this item.");
  });

  it("should throw an error if item is too far away", async () => {
    const pickupValid = await itemPickupValidator.isItemPickupValid(
      generatePickupData({
        x: FromGridX(999),
        y: FromGridY(999),
      }),
      testCharacter
    );

    expect(pickupValid).toBeFalsy();

    expect(sendErrorMessageToCharacter).toHaveBeenCalledWith(
      testCharacter,
      "Sorry, you are too far away to pick up this item."
    );
  });

  it("should throw an error if user tries to pickup an item that he doesn't own", async () => {
    testItem.owner = "62b792030c3f470048781135" as unknown as Types.ObjectId; // inexistent character
    // to have an owner, an item must be in a container, not on the map!
    testItem.x = undefined;
    testItem.y = undefined;
    testItem.scene = undefined;
    await testItem.save();

    const pickupValid = await itemPickupValidator.isItemPickupValid(generatePickupData(), testCharacter);

    expect(pickupValid).toBeFalsy();

    expect(sendErrorMessageToCharacter).toHaveBeenCalledWith(testCharacter, "Sorry, this item is not yours.");
  });

  it("should throw an error if the user tries to pickup an item and is banned or not online", async () => {
    testCharacter.isBanned = true;
    await testCharacter.save();

    const pickupValid1 = await itemPickupValidator.isItemPickupValid(generatePickupData(), testCharacter);

    expect(pickupValid1).toBeFalsy();

    testCharacter.isBanned = false;
    testCharacter.isOnline = false;
    await testCharacter.save();

    const pickupValid2 = await itemPickupValidator.isItemPickupValid(generatePickupData(), testCharacter);

    expect(pickupValid2).toBeFalsy();
  });

  it("should throw an error if the user tries to pickup an item, without an inventory", async () => {
    const charEquip = await Equipment.findOne({ _id: testCharacter.equipment });

    if (charEquip) {
      charEquip.inventory = undefined;
      await charEquip.save();

      const pickupValid = await itemPickupValidator.isItemPickupValid(generatePickupData(), testCharacter);

      expect(pickupValid).toBeFalsy();

      expect(sendErrorMessageToCharacter).toHaveBeenCalledWith(
        testCharacter,
        "Sorry, you need an inventory to pick this item."
      );
    } else {
      throw new Error("Failed to remove character equipment!");
    }
  });

  it("should throw an error if the character tries to pickup an item that's from another map", async () => {
    testItem.scene = "another-random-scene";
    await testItem.save();

    const pickupValid = await itemPickupValidator.isItemPickupValid(generatePickupData(), testCharacter);

    expect(pickupValid).toBeFalsy();

    expect(sendErrorMessageToCharacter).toHaveBeenCalledWith(
      testCharacter,
      "Sorry, you can't pick up items from another map."
    );
  });

  it("should properly pickup a stackable item from a dead body", async () => {
    const deadBody = await unitTestHelper.createMockItemFromBlueprint(BodiesBlueprint.NPCBody, {
      key: "npc-test-dead-body",
      texturePath: "kid-1/death/0.png",
      description: "A dead body. It really stinks.",
      name: "Test Dead body",
    });

    const deadBodyContainer = await ItemContainer.findOne({ parentItem: deadBody.id });

    const stackableItem = await unitTestHelper.createMockItemFromBlueprint(OthersBlueprint.GoldCoin, {
      stackQty: 10,
    });

    expect(deadBodyContainer).toBeTruthy();

    if (deadBodyContainer) {
      deadBodyContainer.slotQty = 20;
      deadBodyContainer.slots = {
        ...deadBodyContainer.slots,
        0: stackableItem.toJSON({ virtuals: true }),
      };
      deadBodyContainer.markModified("slots");
      await deadBodyContainer.save();

      const pickupValid = await itemPickupValidator.isItemPickupValid(
        generatePickupData({
          itemId: stackableItem.id,
          fromContainerId: deadBodyContainer.id,
        }),
        testCharacter
      );

      expect(pickupValid).toBeTruthy();
    }
  });

  it("should block the item pickup, if the item is too heavy", async () => {
    const heavyItem = await unitTestHelper.createMockItem({
      weight: 999,
    });

    const pickupValid = await itemPickupValidator.isItemPickupValid(
      generatePickupData({
        itemId: heavyItem.id,
      }),
      testCharacter
    );

    expect(pickupValid).toBeFalsy();

    expect(sendErrorMessageToCharacter).toHaveBeenCalledWith(
      testCharacter,
      "Sorry, you are already carrying too much weight!"
    );
  });

  it("shouldn't add more items, if your inventory is full", async () => {
    const smallContainer = new ItemContainer({
      id: inventoryItemContainerId,
      parentItem: inventory.id,
    });
    smallContainer.slotQty = 1;
    smallContainer.slots = {
      0: testItem,
    };
    await smallContainer.save();

    const pickupValid = await itemPickupValidator.isItemPickupValid(
      generatePickupData({
        toContainerId: smallContainer.id,
      }),
      testCharacter
    );

    expect(pickupValid).toBeFalsy();

    expect(sendErrorMessageToCharacter).toHaveBeenCalled();
    expect(sendErrorMessageToCharacter).toHaveBeenCalledWith(testCharacter, "Sorry, your container is full.");
  });

  it("should block an item container pickup, if character is trying to pickup to itself", async () => {});
});
