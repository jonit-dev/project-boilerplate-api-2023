import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { container, unitTestHelper } from "@providers/inversify/container";
import { PickPocket } from "../PickPocket";
import { CharacterItemInventory } from "@providers/character/characterItems/CharacterItemInventory";
import { Types } from "mongoose";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { itemsBlueprintIndex } from "@providers/item/data";
import { CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CharacterItemContainer } from "@providers/character/characterItems/CharacterItemContainer";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";

describe("PickPocket.ts", () => {
  let pickPocket: PickPocket;
  let testCharacter: ICharacter;
  let targetCharacter: ICharacter;
  let sendErrorMessageToCharacter: jest.SpyInstance;
  let inventory: IItem;
  let inventoryContainer: IItemContainer;

  beforeAll(() => {
    pickPocket = container.get<PickPocket>(PickPocket);
  });

  beforeEach(async () => {
    testCharacter = await unitTestHelper.createMockCharacter(
      {},
      { hasEquipment: true, hasInventory: true, hasSkills: true }
    );

    targetCharacter = await unitTestHelper.createMockCharacter(null, {
      hasEquipment: true,
      hasInventory: true,
      hasSkills: true,
    });

    inventory = await targetCharacter.inventory;
    inventoryContainer = (await ItemContainer.findById(inventory.itemContainer)) as unknown as IItemContainer;

    sendErrorMessageToCharacter = jest.spyOn(SocketMessaging.prototype, "sendErrorMessageToCharacter");
    sendErrorMessageToCharacter.mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully steal an item from the target", async () => {
    const basicItem = itemsBlueprintIndex[CraftingResourcesBlueprint.Worm];

    const itemMock = new Item({
      ...basicItem,
      _id: Types.ObjectId(),
      stackQty: 10,
    }) as IItem;

    await itemMock.save();

    const targetInventoryMock = jest.spyOn(CharacterItemInventory.prototype, "getAllItemsFromInventoryNested");
    targetInventoryMock.mockImplementation();
    targetInventoryMock.mockReturnValue(Promise.resolve([itemMock]));

    const decrementItemMock = jest.spyOn(CharacterItemInventory.prototype, "decrementItemFromInventory");
    decrementItemMock.mockImplementation();
    decrementItemMock.mockReturnValue(Promise.resolve(true));

    const addItemMock = jest.spyOn(CharacterItemContainer.prototype, "addItemToContainer");
    addItemMock.mockImplementation();
    addItemMock.mockReturnValue(Promise.resolve(true));

    const sendEventMock = jest.spyOn(SocketMessaging.prototype, "sendMessageToCharacter");

    await unitTestHelper.addItemsToContainer(inventoryContainer, 10, [itemMock]);

    expect(inventoryContainer.slots[0]._id).toEqual(itemMock._id);
    expect(await pickPocket.handlePickPocket(testCharacter, targetCharacter)).toBeTruthy();

    const updatedInventoryContainer = (await ItemContainer.findById(
      inventoryContainer.id
    )) as unknown as IItemContainer;

    expect(updatedInventoryContainer.slots[0].stackQty).toEqual(9);

    expect(sendErrorMessageToCharacter).toBeCalledTimes(0);
    expect(sendEventMock).toBeCalledTimes(2);

    let article = "a";
    if ("aeiouAEIOU".includes(itemMock.name.charAt(0))) {
      article = "an";
    }

    expect(sendEventMock).toHaveBeenNthCalledWith(1, testCharacter, `You stole ${article} ${itemMock.name}!`);
    expect(sendEventMock).toHaveBeenNthCalledWith(2, targetCharacter, `You lost ${article} ${itemMock.name}!`);
  });
});
