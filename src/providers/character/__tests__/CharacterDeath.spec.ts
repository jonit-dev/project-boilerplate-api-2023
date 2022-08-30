/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment, IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { CharacterDeath } from "../CharacterDeath";

describe("CharacterDeath.ts", () => {
  let characterDeath: CharacterDeath;
  let testCharacter: ICharacter;
  let testNPC: INPC;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();

    characterDeath = container.get<CharacterDeath>(CharacterDeath);
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);

    testNPC = await unitTestHelper.createMockNPC();
    testCharacter = await unitTestHelper.createMockCharacter();
  });

  it("should properly generate a character body on death", async () => {
    await characterDeath.handleCharacterDeath(testNPC, testCharacter);

    const charBody = await Item.findOne({
      owner: testCharacter._id,
    });

    expect(charBody).toBeDefined();
  });

  it("should respawn a character after its death", async () => {
    await characterDeath.handleCharacterDeath(testNPC, testCharacter);

    expect(testCharacter.health === testCharacter.maxHealth).toBeTruthy();
    expect(testCharacter.mana === testCharacter.maxMana).toBeTruthy();
    expect(testCharacter.x === testCharacter.initialX).toBeTruthy();
    expect(testCharacter.y === testCharacter.initialY).toBeTruthy();
    expect(testCharacter.scene === testCharacter.initialScene).toBeTruthy();
  });

  it("should properly warn characters around, about character's death", async () => {
    // @ts-ignore
    const spySocketMessaging = jest.spyOn(characterDeath.socketMessaging, "sendEventToUser");

    await characterDeath.handleCharacterDeath(testNPC, testCharacter);

    expect(spySocketMessaging).toHaveBeenCalled();
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});

describe("CharacterDeath.ts | Character with items", () => {
  let characterDeath: CharacterDeath;
  let testCharacter: ICharacter;
  let backpackContainer: IItemContainer;
  let characterEquipment: IEquipment;
  let testNPC: INPC;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();
    characterDeath = container.get<CharacterDeath>(CharacterDeath);
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);
    testNPC = await unitTestHelper.createMockNPC();
    testCharacter = await unitTestHelper.createMockCharacter(null, { hasEquipment: true, hasInventory: true });

    characterEquipment = (await Equipment.findById(testCharacter.equipment).populate("inventory").exec()) as IEquipment;

    // Add items to character's equipment
    const equipment = await unitTestHelper.createEquipment();
    characterEquipment.head = equipment.neck;
    characterEquipment.neck = equipment.head;
    await characterEquipment.save();

    // Add items to character's backpack
    const backpack = characterEquipment.inventory as unknown as IItem;
    backpackContainer = await unitTestHelper.createMockBackpackItemContainer(backpack);

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
  });

  it("should drop all character's backpack items on its dead body", async () => {
    // @ts-ignore
    const spyDropCharacterItemsOnBody = jest.spyOn(characterDeath, "dropCharacterItemsOnBody");

    // initially, character's backpack has 2 items
    expect(backpackContainer.slots[0]).not.toBeNull();
    expect(backpackContainer.slots[1]).not.toBeNull();

    // character dies
    await characterDeath.handleCharacterDeath(testNPC, testCharacter);

    expect(spyDropCharacterItemsOnBody).toHaveBeenCalled();

    const characterBody = await Item.findOne({
      name: `${testCharacter.name}'s body`,
      scene: testCharacter.scene,
    })
      .populate("itemContainer")
      .exec();

    const bodyItemContainer = characterBody!.itemContainer as unknown as IItemContainer;

    expect(characterBody).not.toBeNull();

    // body should have the 2 items that were in backpack
    expect(characterBody!.itemContainer).toBeDefined();
    expect(bodyItemContainer.slots).toBeDefined();
    expect(bodyItemContainer.slots[0]).not.toBeNull();
    expect(bodyItemContainer.slots[1]).not.toBeNull();

    // backpack should be empty
    backpackContainer = (await ItemContainer.findById(backpackContainer._id)) as IItemContainer;

    expect(backpackContainer.slots).toBeDefined();
    for (let i = 0; i < backpackContainer.slotQty; i++) {
      expect(backpackContainer.slots[i]).toBeNull();
    }
  });

  it("should drop equipment item on character's dead body", async () => {
    // @ts-ignore
    const characterBody = (await characterDeath.generateCharacterBody(testCharacter)) as IItem;

    const bodyItemContainer = (await ItemContainer.findById(characterBody.itemContainer)) as IItemContainer;

    // character is equipped with 2 items (head and neck)
    expect(characterEquipment.neck).toBeDefined();
    expect(characterEquipment.head).toBeDefined();
    // call 3 times the dropEquippedItemOnBody with 100% chance
    // of dropping the items to drop both of them
    // and make one extra call that should not add anything to the body container
    for (let i = 0; i < 3; i++) {
      // @ts-ignore
      await characterDeath.dropEquippedItemOnBody(bodyItemContainer, characterEquipment, 100);
    }

    const updatedEquipment = (await Equipment.findById(characterEquipment._id)) as IEquipment;

    // character equipment is empty
    expect(updatedEquipment.neck).not.toBeDefined();
    expect(updatedEquipment.head).not.toBeDefined();

    // dead body contains the items
    expect(bodyItemContainer!.slots).toBeDefined();
    expect(bodyItemContainer!.slots[0]).not.toBeNull();
    expect(bodyItemContainer!.slots[1]).not.toBeNull();
    expect(bodyItemContainer!.slots[2]).toBeNull();
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
