import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill } from "@entities/ModuleCharacter/SkillsModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { ContainersBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { CharacterSocketEvents } from "@rpg-engine/shared";
import { CharacterDeath } from "../../CharacterDeath";
import { CharacterItemContainer } from "../../characterItems/CharacterItemContainer";
import { CharacterWeight } from "../CharacterWeight";

describe("CharacterWeight.ts", () => {
  let testCharacter: ICharacter;
  let characterWeight: CharacterWeight;
  let inventoryContainer: IItemContainer;
  let characterDeath: CharacterDeath;
  let testNPC: INPC;
  let characterItemContainer: CharacterItemContainer;
  const mockSendEventToUser = jest.fn();

  beforeAll(() => {
    characterWeight = container.get<CharacterWeight>(CharacterWeight);
    characterDeath = container.get<CharacterDeath>(CharacterDeath);
    characterItemContainer = container.get<CharacterItemContainer>(CharacterItemContainer);

    jest.spyOn(SocketMessaging.prototype, "sendEventToUser").mockImplementation(mockSendEventToUser);

    // @ts-ignore
    jest.spyOn(characterDeath.characterDeathCalculator, "calculateInventoryDropChance").mockImplementation(() => 100);
  });

  beforeEach(async () => {
    mockSendEventToUser.mockReset();

    testCharacter = await (
      await unitTestHelper.createMockCharacter(null, {
        hasSkills: true,
        hasEquipment: true,
        hasInventory: true,
      })
    )
      .populate("skills")
      .execPopulate();

    testNPC = await unitTestHelper.createMockNPC();

    const inventory = await testCharacter.inventory;
    inventoryContainer = (await ItemContainer.findById(inventory.itemContainer)) as unknown as IItemContainer;
  });

  it("should properly calculate the character maxWeight", async () => {
    const maxWeight = await characterWeight.getMaxWeight(testCharacter);

    const skills = testCharacter.skills as unknown as ISkill;

    expect(maxWeight).toBe(skills.level * 15);
  });

  it("should properly calculate the character weight", async () => {
    const weight = await characterWeight.getWeight(testCharacter);

    expect(weight).toBe(3);
  });

  it("should add 100 coins and test the return of weight", async () => {
    const beforeAddGoldCoins = await characterWeight.getWeight(testCharacter);
    expect(beforeAddGoldCoins).toBe(3);

    const goldCoins = await unitTestHelper.createGoldCoinMockItem({
      stackQty: 100,
      maxStackSize: 100,
      carrier: testCharacter._id,
      owner: testCharacter._id,
    });

    inventoryContainer = await unitTestHelper.addItemsToContainer(inventoryContainer, 1, [goldCoins]);

    const afterAddGoldCoins = await characterWeight.getWeight(testCharacter);
    expect(afterAddGoldCoins).toBe(4);
  });

  it("should add a armor/sword and test the return of weight", async () => {
    const beforeAddArmor = await characterWeight.getWeight(testCharacter);
    expect(beforeAddArmor).toBe(3);

    await unitTestHelper.createMockAndEquipItens(testCharacter, {
      carrier: testCharacter._id,
      owner: testCharacter._id,
    });

    const afterAddArmor = await characterWeight.getWeight(testCharacter);
    expect(afterAddArmor).toBe(9);
  });

  it("should add 100 Apple, Consume and check the return of weight", async () => {
    const beforeAddApples = await characterWeight.getWeight(testCharacter);
    expect(beforeAddApples).toBe(3);

    const apples = await unitTestHelper.createStackableMockItem({
      stackQty: 100,
      maxStackSize: 100,
      carrier: testCharacter._id,
      owner: testCharacter._id,
    });

    inventoryContainer = await unitTestHelper.addItemsToContainer(inventoryContainer, 1, [apples]);

    // Check Weight after add apples
    const afterAddApples = await characterWeight.getWeight(testCharacter);
    expect(afterAddApples).toBe(8);

    // Consume 1 item
    await unitTestHelper.consumeMockItem(testCharacter, inventoryContainer, apples);
    const afterConsumeApple = await characterWeight.getWeight(testCharacter);

    expect(afterConsumeApple).toBe(7.95);

    // Consume another one
    await unitTestHelper.consumeMockItem(testCharacter, inventoryContainer, apples);
    const afterSecondConsume = await characterWeight.getWeight(testCharacter);

    expect(afterSecondConsume).toBe(7.9);

    // Consume All
    const applesLeft = apples?.stackQty;
    if (applesLeft) {
      for (let i = 0; i < applesLeft; i++) {
        const result = await unitTestHelper.consumeMockItem(testCharacter, inventoryContainer, apples);

        // Check if any item is left or weight is correct
        if (result === false) {
          const afterConsumeAllApple = await characterWeight.getWeight(testCharacter);
          expect(afterConsumeAllApple).toBe(3);

          const appleItens = (await Item.findById(apples.id)) as unknown as IItem;
          expect(appleItens).toBeNull();
        }
      }
    }

    const afterAllAplles = await characterWeight.getWeight(testCharacter);
    expect(afterAllAplles).toBe(3);
  });

  it("After death, one of equipment will drop and the weight should update.", async () => {
    jest.useFakeTimers({
      advanceTimers: true,
    });

    await characterWeight.updateCharacterWeight(testCharacter);
    const beforeAddArmor = await Character.findOne(testCharacter._id).lean();
    expect(beforeAddArmor?.weight).toBe(3);
    expect(mockSendEventToUser).toBeCalledTimes(1);
    expect(mockSendEventToUser).toBeCalledWith(beforeAddArmor?.channelId, CharacterSocketEvents.AttributeChanged, {
      maxWeight: 15,
      speed: testCharacter.speed,
      targetId: testCharacter._id,
      weight: 3,
    });

    await unitTestHelper.createMockAndEquipItens(testCharacter, {
      carrier: testCharacter._id,
      owner: testCharacter._id,
    });
    await characterWeight.updateCharacterWeight(testCharacter);
    const afterAddArmor = await Character.findOne(testCharacter._id).lean();

    expect(afterAddArmor?.weight).toBe(9);

    // when die you loose your backpack: -3 weight.
    // but when you respawn you get a new bag: +1.5 weight
    await characterDeath.handleCharacterDeath(testNPC, testCharacter);

    await characterWeight.updateCharacterWeight(testCharacter);

    const weightAfterDeath = await Character.findOne(testCharacter._id).lean();

    // bag(1.5)                       = 1.5
    // sword(1) + bag(1.5)            = 2.5
    // armor(5) + bag(1.5)            = 6.5
    // armor(5) + sword(1) + bag(1.5) = 7.5
    // When die have a % do drop a item, its random so we can't test it with ONE number fixed.
    const possibleResults = [7.5, 6.5, 2.5, 1.5];
    expect(possibleResults).toContain(weightAfterDeath?.weight);
  });

  it("Should calculate the Weight if have nested bags with itens on inventory", async () => {
    const nestedBackpack = await unitTestHelper.createMockItemFromBlueprint(ContainersBlueprint.Backpack, {
      owner: testCharacter._id,
    });
    const nestedContainer = (await ItemContainer.findById(nestedBackpack.itemContainer)) as IItemContainer;

    const fisrtSword = await unitTestHelper.createMockItem({
      owner: testCharacter._id,
    });
    const secondSword = await unitTestHelper.createMockItem({
      owner: testCharacter._id,
    });

    nestedContainer.slotQty = 2;
    nestedContainer.slots = {
      0: fisrtSword.toJSON({ virtuals: true }),
      1: secondSword.toJSON({ virtuals: true }),
    };

    await nestedContainer.save();

    const nestedItem = (await Item.findOne({ _id: nestedContainer.parentItem })) as IItem;
    const result = await characterItemContainer.addItemToContainer(nestedItem, testCharacter, inventoryContainer._id);

    expect(result).toBe(true);

    expect(await characterWeight.getWeight(testCharacter)).toBe(8);
  });
});
