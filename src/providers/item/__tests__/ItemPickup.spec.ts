/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment } from "@entities/ModuleCharacter/EquipmentModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { FromGridX, FromGridY } from "@rpg-engine/shared";
import { Types } from "mongoose";
import { ItemPickup } from "../ItemPickup";

describe("ItemPickup.ts", () => {
  let itemPickup: ItemPickup;
  let testCharacter: ICharacter;
  let testItem: IItem;
  let inventory: IItem;
  let sendCustomErrorMessage: jest.SpyInstance;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();

    itemPickup = container.get<ItemPickup>(ItemPickup);
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);

    testCharacter = await unitTestHelper.createMockCharacter(null, { hasEquipment: true, hasInventory: true });
    testItem = await unitTestHelper.createMockItem();
    inventory = await testCharacter.inventory;

    testCharacter.x = FromGridX(1);
    testCharacter.y = FromGridY(0);
    await testCharacter.save();
    await testItem.save();

    sendCustomErrorMessage = jest.spyOn(itemPickup, "sendCustomErrorMessage" as any);
  });

  const pickupItem = async (extraProps?: Record<string, unknown>) => {
    const itemAdded = await itemPickup.performItemPickup(
      {
        itemId: testItem.id,
        x: testCharacter.x,
        y: testCharacter.y,
        scene: testCharacter.scene,
        toContainerId: inventory.id,
        ...extraProps,
      },
      testCharacter
    );
    return itemAdded;
  };

  it("should add item to character inventory", async () => {
    const itemAdded = await pickupItem();

    expect(itemAdded).toBeTruthy();
  });

  describe("Item pickup validation", () => {
    it("should throw an error if container is not accessible", async () => {
      const pickup = await pickupItem({
        itemId: "62b792030c3f470048781135", // inexistent item
      });
      expect(pickup).toBeFalsy();

      expect(sendCustomErrorMessage).toHaveBeenCalledWith(testCharacter, "Sorry, this item is not accessible.");
    });

    it("should throw an error if item is too far away", async () => {
      const pickup = await pickupItem({
        x: FromGridX(999),
        y: FromGridY(999),
      });
      expect(pickup).toBeFalsy();

      expect(sendCustomErrorMessage).toHaveBeenCalledWith(
        testCharacter,
        "Sorry, you are too far away to pick up this item."
      );
    });

    it("should throw an error if user tries to pickup an item that he doesn't own", async () => {
      testItem.owner = "62b792030c3f470048781135" as unknown as Types.ObjectId; // inexistent character
      testItem.x = testCharacter.x;
      testItem.y = testCharacter.y;
      await testItem.save();

      const pickup = await pickupItem();
      expect(pickup).toBeFalsy();

      expect(sendCustomErrorMessage).toHaveBeenCalledWith(testCharacter, "Sorry, this item is not yours.");
    });

    it("should throw an error if the user tries to pickup an item and is banned or not online", async () => {
      testCharacter.isBanned = true;
      await testCharacter.save();

      const pickup = await pickupItem();
      expect(pickup).toBeFalsy();

      expect(sendCustomErrorMessage).toHaveBeenCalledWith(
        testCharacter,
        "Sorry, you are banned and can't pick up this item."
      );

      testCharacter.isBanned = false;
      testCharacter.isOnline = false;
      await testCharacter.save();

      const pickup2 = await pickupItem();
      expect(pickup2).toBeFalsy();

      expect(sendCustomErrorMessage).toHaveBeenCalledWith(
        testCharacter,
        "Sorry, you must be online to pick up this item."
      );
    });

    it("should throw an error if the user tries to pickup an item, without an inventory", async () => {
      const charEquip = await Equipment.findOne({ _id: testCharacter.equipment });

      console.log(charEquip);

      if (charEquip) {
        charEquip.inventory = undefined;
        await charEquip.save();

        console.log("inventory", await testCharacter.inventory);

        const pickup = await pickupItem();
        expect(pickup).toBeFalsy();

        expect(sendCustomErrorMessage).toHaveBeenCalledWith(
          testCharacter,
          "Sorry, you must have a bag or backpack to pick up this item."
        );
      } else {
        throw new Error("Failed to remove character equipment!");
      }
    });
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
