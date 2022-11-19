/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment, IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { IUseWithTileEffect, OthersBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { FromGridX, FromGridY, IUseWithTile, MapLayers } from "@rpg-engine/shared";
import { UseWithTile } from "../UseWithTile";

describe("UseWithTile.ts", () => {
  let testItem: IItem,
    testCharacter: ICharacter,
    testCharacterEquipment: IEquipment,
    testCharacterItemContainer: IItemContainer,
    useWithTile: UseWithTile,
    useWithTileData: IUseWithTile;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();
    useWithTile = container.get<UseWithTile>(UseWithTile);
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);
    testCharacter = await unitTestHelper.createMockCharacter(null, { hasEquipment: true, hasInventory: true });
    testCharacterEquipment = (await Equipment.findById(testCharacter.equipment)
      .populate("inventory")
      .exec()) as unknown as IEquipment;
    testItem = await unitTestHelper.createMockItem();

    // create itemContainer for character backpack
    testCharacterItemContainer = await addBackpackContainer(testCharacterEquipment.inventory as unknown as IItem);

    // Define a useWithEffect functionality for the testItem
    itemsBlueprintIndex[testItem.baseKey] = useWithEffectTestExample;

    // Locate character close to the tile
    testCharacter.x = FromGridX(0);
    testCharacter.y = FromGridY(1);
    await testCharacter.save();

    useWithTileData = {
      originItemId: testItem.id,
      targetTile: {
        x: FromGridX(0),
        y: FromGridY(0),
        map: "example",
        layer: MapLayers.Ground,
      },
    };

    // equip character with item
    testCharacterEquipment.leftHand = testItem._id;
    await testCharacterEquipment.save();
  });

  it("should pass all validations, run the useWithEffect and apply expected effect", async () => {
    // @ts-ignore
    jest.spyOn(useWithTile.mapTiles, "getUseWithKey" as any).mockImplementation(() => testItem.baseKey);

    // @ts-ignore
    const response = await useWithTile.validateData(testCharacter, useWithTileData);
    expect(response).toBeDefined();
    expect(response!.originItem.id).toEqual(testItem.id);

    await (response!.useWithItemEffect as IUseWithTileEffect)(
      response!.originItem,
      useWithTileData.targetTile,
      testCharacter
    );

    // Check if character has the coins in the bag
    const backpackContainer = (await ItemContainer.findById(
      testCharacterItemContainer.id
    )) as unknown as IItemContainer;
    expect(backpackContainer.slots[0]).toBeDefined();
    expect(backpackContainer.slots[0].key).toEqual(OthersBlueprint.GoldCoin);
    expect(backpackContainer.slots[0].stackQty).toEqual(5);
  });

  it("should fail validations | item without useWithEffect function defined", async () => {
    try {
      delete itemsBlueprintIndex[testItem.baseKey];
      // @ts-ignore
      await useWithTile.validateData(testCharacter, useWithTileData);
      throw new Error("This test should fail!");
    } catch (error: any) {
      expect(error.message).toEqual(
        `UseWithTile > originItem '${testItem.baseKey}' does not have a useWithEffect function defined`
      );
    }
  });

  it("should fail validations | character too far away from tile", async () => {
    testCharacter.x = FromGridX(5);
    testCharacter.y = FromGridY(5);
    await testCharacter.save();

    // @ts-ignore
    const sendErrorMsg = jest.spyOn(useWithTile.socketMessaging, "sendErrorMessageToCharacter" as any);

    // @ts-ignore
    const response = await useWithTile.validateData(testCharacter, useWithTileData);
    expect(response).toBeUndefined();
    expect(sendErrorMsg).toHaveBeenCalled();
  });

  it("validations should fail | character does not own item", async () => {
    try {
      testCharacterEquipment.leftHand = undefined;
      await testCharacterEquipment.save();
      // @ts-ignore
      await useWithTile.validateData(testCharacter, useWithTileData);
      throw new Error("This test should failed!");
    } catch (error: any) {
      expect(error.message).toEqual("UseWith > Character does not own the item that wants to use");
    }
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});

async function addBackpackContainer(backpack: IItem): Promise<IItemContainer> {
  const backpackContainer = await unitTestHelper.createMockBackpackItemContainer(backpack);

  await Item.updateOne(
    {
      _id: backpack._id,
    },
    {
      $set: {
        itemContainer: backpackContainer._id,
      },
    }
  );

  backpackContainer.slots[0] = null;
  backpackContainer.markModified("slots");
  return backpackContainer.save();
}

async function useWithEffectTestExample(item: IItem, character: ICharacter) {
  // EXAMPLE: Using testItem with tile will mint 5 gold coins to the characters bag
  const coinBlueprint = itemsBlueprintIndex[OthersBlueprint.GoldCoin];
  const newCoins = new Item({ ...coinBlueprint });
  newCoins.stackQty = 5;

  const equipment = await Equipment.findById(character.equipment).populate("inventory").exec();
  if (!equipment) {
    throw new Error("Character does not have equipment");
  }
  const backpack = equipment.inventory as unknown as IItem;
  const backpackContainer = (await ItemContainer.findById(backpack.itemContainer)) as unknown as IItemContainer;
  if (!backpackContainer) {
    throw new Error("Character does not have item container");
  }

  const slotId = backpackContainer.firstAvailableSlotId;
  if (slotId === null) {
    throw new Error("No slots available");
  }
  backpackContainer.slots[slotId] = await newCoins.save();

  backpackContainer.markModified("slots");
  await backpackContainer.save();
}
