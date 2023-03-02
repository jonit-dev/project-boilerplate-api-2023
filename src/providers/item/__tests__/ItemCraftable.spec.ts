import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Skill } from "@entities/ModuleCharacter/SkillsModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { CharacterValidation } from "@providers/character/CharacterValidation";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import { container, unitTestHelper } from "@providers/inversify/container";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { recipeSpikedClub } from "@providers/useWith/recipes/maces/recipeSpikedClub";
import { recipeBolt } from "@providers/useWith/recipes/ranged-weapons/recipeBolt";
import {
  AnimationSocketEvents,
  CharacterSocketEvents,
  ItemRarities,
  ItemSocketEvents,
  ItemSubType,
  UISocketEvents,
} from "@rpg-engine/shared";
import { ItemCraftable } from "../ItemCraftable";
import { itemBlueFeather } from "../data/blueprints/crafting-resources/ItemBlueFeather";
import { itemHerb } from "../data/blueprints/crafting-resources/ItemHerb";
import { itemWaterBottle } from "../data/blueprints/crafting-resources/itemWaterBottle";
import { itemManaPotion } from "../data/blueprints/potions/ItemManaPotion";
import { CraftingResourcesBlueprint } from "../data/types/itemsBlueprintTypes";

describe("ItemCraftable.ts", () => {
  let craftableItem: ItemCraftable;
  let inventoryContainer: IItemContainer;
  let testCharacter: ICharacter;
  let inventory: IItem;
  let sendEventToUser: jest.SpyInstance;
  let items: IItem[];

  beforeAll(() => {
    craftableItem = container.get<ItemCraftable>(ItemCraftable);
  });

  beforeEach(async () => {
    testCharacter = await unitTestHelper.createMockCharacter(
      { health: 50, mana: 50 },
      { hasEquipment: true, hasInventory: true, hasSkills: true }
    );

    inventory = await testCharacter.inventory;
    inventoryContainer = (await ItemContainer.findById(inventory.itemContainer)) as unknown as IItemContainer;

    items = [
      await unitTestHelper.createMockItemFromBlueprint(CraftingResourcesBlueprint.Herb, { stackQty: 3 }),
      await unitTestHelper.createMockItemFromBlueprint(CraftingResourcesBlueprint.BlueFeather, { stackQty: 1 }),
      await unitTestHelper.createMockItemFromBlueprint(CraftingResourcesBlueprint.WaterBottle, { stackQty: 1 }),
    ];

    await unitTestHelper.addItemsToInventoryContainer(inventoryContainer, 6, items);

    sendEventToUser = jest.spyOn(SocketMessaging.prototype, "sendEventToUser");
  });

  it("should load craftable items", async () => {
    await craftableItem.loadCraftableItems(ItemSubType.Magic, testCharacter);

    expect(sendEventToUser).toHaveBeenCalledTimes(1);

    const args = sendEventToUser.mock.calls[0];

    expect(args[0]).toEqual(testCharacter.channelId);
    expect(args[1]).toEqual(ItemSocketEvents.CraftableItems);

    const craftableItems = expect.arrayContaining([
      expect.objectContaining({
        key: itemManaPotion.key,
        canCraft: true,
        name: itemManaPotion.name,
        texturePath: itemManaPotion.texturePath,
        ingredients: expect.arrayContaining([
          {
            key: itemHerb.key,
            name: itemHerb.name,
            qty: 3,
            texturePath: itemHerb.texturePath,
          },
          expect.objectContaining({
            key: itemBlueFeather.key,
            qty: 1,
          }),
          expect.objectContaining({
            key: itemWaterBottle.key,
            qty: 1,
          }),
        ]),
      }),
    ]);

    expect(args[2]).toEqual(craftableItems);
  });

  it("sould craft non stackable item", async () => {
    const craftChanceMock = jest.spyOn(ItemCraftable.prototype as any, "isCraftSuccessful");
    craftChanceMock.mockImplementation(() => {
      return Promise.resolve(true);
    });

    await craftableItem.craftItem(itemManaPotion.key!, testCharacter);

    const container = (await ItemContainer.findById(inventory.itemContainer)) as unknown as IItemContainer;

    expect(container.slots[1]).toBe(null);
    expect(container.slots[2]).toBe(null);

    const potion = container.slots[0];
    expect(potion).not.toBe(null);
    expect(potion.key).toEqual(itemManaPotion.key);
  });

  it("sould craft stackable item", async () => {
    const craftChanceMock = jest.spyOn(ItemCraftable.prototype as any, "isCraftSuccessful");
    craftChanceMock.mockImplementation(() => {
      return Promise.resolve(true);
    });

    await unitTestHelper.addItemsToInventoryContainer(inventoryContainer, 6, [
      await unitTestHelper.createMockItemFromBlueprint(CraftingResourcesBlueprint.SmallWoodenStick, { stackQty: 1 }),
      await unitTestHelper.createMockItemFromBlueprint(CraftingResourcesBlueprint.SteelIngot, { stackQty: 1 }),
    ]);

    await craftableItem.craftItem(recipeBolt.outputKey!, testCharacter);

    const container = (await ItemContainer.findById(inventory.itemContainer)) as unknown as IItemContainer;

    expect(container.slots[1]).toBe(null);

    const bolt = container.slots[0];

    expect(bolt).not.toBe(null);
    expect(bolt.key).toEqual(recipeBolt.outputKey);
    expect(bolt.stackQty).toBeGreaterThanOrEqual(recipeBolt.outputQtyRange[0]);
    expect(bolt.stackQty).toBeLessThanOrEqual(recipeBolt.outputQtyRange[1]);
  });

  it("sould craft item and have Legendary rarity", async () => {
    const craftChanceMock = jest.spyOn(ItemCraftable.prototype as any, "isCraftSuccessful");
    craftChanceMock.mockImplementation(() => {
      return Promise.resolve(true);
    });

    await unitTestHelper.addItemsToInventoryContainer(inventoryContainer, 6, [
      await unitTestHelper.createMockItemFromBlueprint(CraftingResourcesBlueprint.IronNail, { stackQty: 20 }),
      await unitTestHelper.createMockItemFromBlueprint(CraftingResourcesBlueprint.GreaterWoodenLog, { stackQty: 4 }),
      await unitTestHelper.createMockItemFromBlueprint(CraftingResourcesBlueprint.Skull, { stackQty: 1 }),
    ]);

    await Skill.findByIdAndUpdate(testCharacter.skills, { blacksmithing: { level: 1000 } });

    await craftableItem.craftItem(recipeSpikedClub.outputKey!, testCharacter);

    const container = (await ItemContainer.findById(inventory.itemContainer)) as unknown as IItemContainer;

    expect(container.slots[1]).toBe(null);

    const spikedClub = container.slots[0];

    expect(spikedClub).not.toBe(null);
    expect(spikedClub.key).toEqual(recipeSpikedClub.outputKey);
    expect(spikedClub.rarity).toEqual(ItemRarities.Legendary);
    expect(spikedClub.attack).toEqual(11);
    expect(spikedClub.defense).toEqual(8);
  });

  it("sould change character weight", async () => {
    const craftChanceMock = jest.spyOn(ItemCraftable.prototype as any, "isCraftSuccessful");
    craftChanceMock.mockImplementation(() => {
      return Promise.resolve(true);
    });

    const originalWeight = testCharacter.weight;

    await craftableItem.craftItem(itemManaPotion.key!, testCharacter);

    const character = await Character.findById(testCharacter._id);
    expect(character!.weight).not.toBe(originalWeight);
  });

  it("sould send inventory update event", async () => {
    const craftChanceMock = jest.spyOn(ItemCraftable.prototype as any, "isCraftSuccessful");
    craftChanceMock.mockImplementation(() => {
      return Promise.resolve(true);
    });

    await craftableItem.craftItem(itemManaPotion.key!, testCharacter);

    const container = (await ItemContainer.findById(inventory.itemContainer)) as unknown as IItemContainer;

    expect(sendEventToUser).toHaveBeenCalledTimes(3);

    expect(sendEventToUser).toHaveBeenCalledWith(testCharacter.channelId!, CharacterSocketEvents.AttributeChanged, {
      targetId: testCharacter._id,
      speed: MovementSpeed.Standard,
    });

    expect(sendEventToUser).toHaveBeenCalledWith(
      testCharacter.channelId!,
      ItemSocketEvents.EquipmentAndInventoryUpdate,
      {
        inventory: container,
        openEquipmentSetOnUpdate: false,
        openInventoryOnUpdate: true,
      }
    );
  });

  it("should call character validation", async () => {
    const performCraftingMock = jest.spyOn(ItemCraftable.prototype as any, "performCrafting");
    performCraftingMock.mockImplementation();

    const characterValidationMock = jest.spyOn(CharacterValidation.prototype, "hasBasicValidation");
    characterValidationMock.mockReturnValue(false);

    await craftableItem.craftItem(itemManaPotion.key!, testCharacter);
    expect(performCraftingMock).not.toBeCalled();

    expect(characterValidationMock).toHaveBeenLastCalledWith(testCharacter);

    performCraftingMock.mockReset();
    characterValidationMock.mockReset();
    characterValidationMock.mockReturnValue(true);

    await craftableItem.craftItem(itemManaPotion.key!, testCharacter);
    expect(performCraftingMock).toBeCalled();
  });

  it("should not craft item if it does not have a blueprint", async () => {
    const performCraftingMock = jest.spyOn(ItemCraftable.prototype as any, "performCrafting");
    performCraftingMock.mockImplementation();

    await craftableItem.craftItem("invalid-blueprint-key", testCharacter);
    expect(performCraftingMock).not.toBeCalled();

    expect(sendEventToUser).toHaveBeenCalledTimes(1);
    expect(sendEventToUser).toHaveBeenCalledWith(testCharacter.channelId, UISocketEvents.ShowMessage, {
      message: "Sorry, this item can not be crafted.",
      type: "error",
    });
  });

  it("should not craft item if it does not have a recipe", async () => {
    const performCraftingMock = jest.spyOn(ItemCraftable.prototype as any, "performCrafting");
    performCraftingMock.mockImplementation();

    await craftableItem.craftItem(CraftingResourcesBlueprint.Wheat, testCharacter);
    expect(performCraftingMock).not.toBeCalled();

    expect(sendEventToUser).toHaveBeenCalledTimes(1);
    expect(sendEventToUser).toHaveBeenCalledWith(testCharacter.channelId, UISocketEvents.ShowMessage, {
      message: "Sorry, this item can not be crafted.",
      type: "error",
    });
  });

  it("should not craft item if character inventory does not have required items", async () => {
    const performCraftingMock = jest.spyOn(ItemCraftable.prototype as any, "performCrafting");
    performCraftingMock.mockImplementation();

    const performTest = async (): Promise<void> => {
      await craftableItem.craftItem(itemManaPotion.key!, testCharacter);
      expect(performCraftingMock).not.toBeCalled();

      expect(sendEventToUser).toHaveBeenCalledTimes(1);
      expect(sendEventToUser).toHaveBeenCalledWith(testCharacter.channelId, UISocketEvents.ShowMessage, {
        message: "Sorry, you do not have required items in your inventory.",
        type: "error",
      });

      performCraftingMock.mockReset();
      sendEventToUser.mockReset();
    };

    await unitTestHelper.addItemsToInventoryContainer(inventoryContainer, 6, []);
    await performTest();

    await unitTestHelper.addItemsToInventoryContainer(inventoryContainer, 6, [items[1]]);
    await performTest();

    await unitTestHelper.addItemsToInventoryContainer(inventoryContainer, 6, [items[1], items[2]]);
    await performTest();

    await unitTestHelper.addItemsToInventoryContainer(inventoryContainer, 6, [
      await unitTestHelper.createMockItemFromBlueprint(CraftingResourcesBlueprint.Herb, { stackQty: 2 }),
      items[1],
      items[2],
    ]);
    await performTest();
  });

  it("should not craft valid item due to crafting failure", async () => {
    const craftChanceMock = jest.spyOn(ItemCraftable.prototype as any, "isCraftSuccessful");
    craftChanceMock.mockImplementation(() => {
      return Promise.resolve(false);
    });

    await craftableItem.craftItem(itemManaPotion.key!, testCharacter);

    const container = (await ItemContainer.findById(inventory.itemContainer)) as unknown as IItemContainer;

    expect(container.slots[0]).toBe(null);
    expect(container.slots[1]).toBe(null);
    expect(container.slots[2]).toBe(null);

    expect(craftChanceMock).toBeCalledTimes(1);
    expect(craftChanceMock).toBeCalledWith(
      expect.objectContaining({
        _id: testCharacter._id,
      })
    );

    expect(sendEventToUser).toHaveBeenCalledTimes(4);

    expect(sendEventToUser).toHaveBeenCalledWith(testCharacter.channelId, AnimationSocketEvents.ShowAnimation, {
      targetId: testCharacter._id,
      effectKey: "miss",
    });

    expect(sendEventToUser).toHaveBeenCalledWith(
      testCharacter.channelId!,
      ItemSocketEvents.EquipmentAndInventoryUpdate,
      {
        inventory: container,
        openEquipmentSetOnUpdate: false,
        openInventoryOnUpdate: true,
      }
    );
  });

  it("sould produce both craft success and failure", async () => {
    const skills = await Skill.findOne({ _id: testCharacter.skills });
    if (skills) {
      const level = 30;
      skills.mining.level = level;
      skills.lumberjacking.level = level - 2;
      skills.cooking.level = level + 4;
      skills.alchemy.level = level - 5;
      await skills.save();
    }

    const results: boolean[] = [];
    for (let i = 0; i < 10; i++) {
      const result: boolean = await (ItemCraftable.prototype as any).isCraftSuccessful(testCharacter);
      results.push(result);
    }

    expect(results.some((r) => r)).toBeTruthy();
    expect(results.some((r) => !r)).toBeTruthy();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
