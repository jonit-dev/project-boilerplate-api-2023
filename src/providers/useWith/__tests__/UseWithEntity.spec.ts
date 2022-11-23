/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill } from "@entities/ModuleCharacter/SkillsModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { CharacterValidation } from "@providers/character/CharacterValidation";
import { ITEM_USE_WITH_ENTITY_GRID_CELL_RANGE } from "@providers/constants/ItemConstants";
import { container, unitTestHelper } from "@providers/inversify/container";
import { itemDarkRune } from "@providers/item/data/blueprints/magics/ItemDarkRune";
import { FoodsBlueprint, MagicsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { ItemValidation } from "@providers/item/validation/ItemValidation";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { GRID_WIDTH, NPCMovementType, UISocketEvents } from "@rpg-engine/shared";
import { EntityType } from "@rpg-engine/shared/dist/types/entity.types";
import { UseWithEntity } from "../UseWithEntity";

describe("UseWithEntityValidation.ts", () => {
  let useWithEntity: UseWithEntity;
  let testCharacter: ICharacter;
  let targetCharacter: ICharacter;
  let testNPC: INPC;
  let characterSkills: ISkill;
  let item1: IItem;
  let inventory: IItem;
  let inventoryContainer: IItemContainer;
  let sendEventToUserMock: jest.SpyInstance;
  let executeEffectMock: jest.SpyInstance;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();
    useWithEntity = container.get<UseWithEntity>(UseWithEntity);
  });

  const addItemsToInventory = async () => {
    const items = [
      await unitTestHelper.createMockItemFromBlueprint(MagicsBlueprint.DarkRune),
      await unitTestHelper.createMockItemFromBlueprint(MagicsBlueprint.DarkRune),
    ];

    item1 = items[1];

    await unitTestHelper.addItemsToInventoryContainer(inventoryContainer, 6, items);
  };

  const prepareData = async () => {
    testCharacter = await unitTestHelper.createMockCharacter(null, {
      hasEquipment: true,
      hasInventory: true,
      hasSkills: true,
    });

    targetCharacter = await unitTestHelper.createMockCharacter(null, {
      hasEquipment: true,
      hasInventory: true,
      hasSkills: true,
    });

    await testCharacter.populate("skills").execPopulate();

    testCharacter.x = 10;
    testCharacter.y = 11;
    await testCharacter.save();

    targetCharacter.x = 11;
    targetCharacter.y = 12;
    await targetCharacter.save();

    testNPC = await unitTestHelper.createMockNPC(null, null, NPCMovementType.Stopped);

    testNPC.x = 15;
    testNPC.y = 15;
    await testNPC.save();

    inventory = await testCharacter.inventory;
    inventoryContainer = (await ItemContainer.findById(inventory.itemContainer)) as unknown as IItemContainer;

    characterSkills = testCharacter.skills as unknown as ISkill;
    characterSkills.magic.level = itemDarkRune.minMagicLevelRequired!;
    await characterSkills.save();

    await addItemsToInventory();
  };

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);
    await prepareData();

    executeEffectMock = jest.spyOn(useWithEntity as any, "executeEffect");
    sendEventToUserMock = jest.spyOn(SocketMessaging.prototype, "sendEventToUser");
  });

  afterEach(() => {
    executeEffectMock.mockRestore();
    sendEventToUserMock.mockRestore();
    jest.restoreAllMocks();
  });

  it("should pass validation for targer character", async () => {
    executeEffectMock.mockImplementation();

    await useWithEntity.execute(
      {
        itemId: item1._id,
        entityId: targetCharacter._id,
        entityType: EntityType.Character,
      },
      testCharacter
    );

    expect(executeEffectMock).toBeCalledTimes(1);
  });

  it("should pass validation for targer npc", async () => {
    executeEffectMock.mockImplementation();

    await useWithEntity.execute(
      {
        itemId: item1._id,
        entityId: testNPC._id,
        entityType: EntityType.NPC,
      },
      testCharacter
    );

    expect(executeEffectMock).toBeCalledTimes(1);
  });

  it("should fail validation if entity id is not passed", async () => {
    executeEffectMock.mockImplementation();

    await useWithEntity.execute(
      {
        itemId: item1._id,
        entityId: "",
        entityType: EntityType.Character,
      },
      testCharacter
    );

    expect(executeEffectMock).toBeCalledTimes(0);
    expect(sendEventToUserMock).toBeCalledTimes(1);

    expect(sendEventToUserMock).toHaveBeenLastCalledWith(testCharacter.channelId, UISocketEvents.ShowMessage, {
      message: "Sorry, your target was not found.",
      type: "error",
    });
  });

  it("should fail validation if entity type is wrong (npc for character entity)", async () => {
    executeEffectMock.mockImplementation();

    await useWithEntity.execute(
      {
        itemId: item1._id,
        entityId: targetCharacter._id,
        entityType: EntityType.NPC,
      },
      testCharacter
    );

    expect(executeEffectMock).toBeCalledTimes(0);
    expect(sendEventToUserMock).toBeCalledTimes(1);

    expect(sendEventToUserMock).toHaveBeenLastCalledWith(testCharacter.channelId, UISocketEvents.ShowMessage, {
      message: "Sorry, your target was not found.",
      type: "error",
    });
  });

  it("should fail validation if entity type is wrong (character for npc entity)", async () => {
    executeEffectMock.mockImplementation();

    await useWithEntity.execute(
      {
        itemId: item1._id,
        entityId: testNPC._id,
        entityType: EntityType.Character,
      },
      testCharacter
    );

    expect(executeEffectMock).toBeCalledTimes(0);
    expect(sendEventToUserMock).toBeCalledTimes(1);

    expect(sendEventToUserMock).toHaveBeenLastCalledWith(testCharacter.channelId, UISocketEvents.ShowMessage, {
      message: "Sorry, your target was not found.",
      type: "error",
    });
  });

  it("should fail validation if item id is not provided", async () => {
    executeEffectMock.mockImplementation();

    await useWithEntity.execute(
      {
        itemId: "",
        entityId: targetCharacter._id,
        entityType: EntityType.Character,
      },
      testCharacter
    );

    expect(executeEffectMock).toBeCalledTimes(0);
    expect(sendEventToUserMock).toBeCalledTimes(1);

    expect(sendEventToUserMock).toHaveBeenLastCalledWith(testCharacter.channelId, UISocketEvents.ShowMessage, {
      message: "Sorry, item you are trying to use was not found.",
      type: "error",
    });
  });

  it("should fail validation if item id is not correct", async () => {
    executeEffectMock.mockImplementation();

    await useWithEntity.execute(
      {
        itemId: testCharacter._id,
        entityId: targetCharacter._id,
        entityType: EntityType.Character,
      },
      testCharacter
    );

    expect(executeEffectMock).toBeCalledTimes(0);
    expect(sendEventToUserMock).toBeCalledTimes(1);

    expect(sendEventToUserMock).toHaveBeenLastCalledWith(testCharacter.channelId, UISocketEvents.ShowMessage, {
      message: "Sorry, item you are trying to use was not found.",
      type: "error",
    });
  });

  it("should fail validation if item blueprint does not exist", async () => {
    executeEffectMock.mockImplementation();

    const itemName = "Invalid Key Item";
    item1.name = itemName;
    item1.key = "invalid-item-key";
    await item1.save();

    await useWithEntity.execute(
      {
        itemId: item1._id,
        entityId: targetCharacter._id,
        entityType: EntityType.Character,
      },
      testCharacter
    );

    expect(executeEffectMock).toBeCalledTimes(0);
    expect(sendEventToUserMock).toBeCalledTimes(1);

    expect(sendEventToUserMock).toHaveBeenLastCalledWith(testCharacter.channelId, UISocketEvents.ShowMessage, {
      message: `Sorry, '${itemName}' cannot be used with target.`,
      type: "error",
    });
  });

  it("should fail validation if item blueprint does not have power", async () => {
    executeEffectMock.mockImplementation();

    const apple = await unitTestHelper.createMockItemFromBlueprint(FoodsBlueprint.Apple);

    await useWithEntity.execute(
      {
        itemId: apple._id,
        entityId: targetCharacter._id,
        entityType: EntityType.Character,
      },
      testCharacter
    );

    expect(executeEffectMock).toBeCalledTimes(0);
    expect(sendEventToUserMock).toBeCalledTimes(1);

    expect(sendEventToUserMock).toHaveBeenLastCalledWith(testCharacter.channelId, UISocketEvents.ShowMessage, {
      message: `Sorry, '${apple.name}' cannot be used with target.`,
      type: "error",
    });
  });

  it("should call character validation with success (for caster and target)", async () => {
    executeEffectMock.mockImplementation();

    const hasBasicValidationMock = jest.spyOn(CharacterValidation.prototype, "hasBasicValidation");

    // if hasBasicValidation returns true
    hasBasicValidationMock.mockImplementation();
    hasBasicValidationMock.mockReturnValue(true);

    await useWithEntity.execute(
      {
        itemId: item1._id,
        entityId: targetCharacter._id,
        entityType: EntityType.Character,
      },
      testCharacter
    );

    expect(executeEffectMock).toBeCalledTimes(1);
    // once for caster once for target
    expect(hasBasicValidationMock).toBeCalledTimes(2);
    expect(hasBasicValidationMock).toHaveBeenNthCalledWith(1, testCharacter);

    expect(hasBasicValidationMock).toHaveBeenNthCalledWith(
      2,
      await Character.findById(targetCharacter._id),
      new Map([
        ["not-online", "Sorry, your target is offline."],
        ["banned", "Sorry, your target is banned."],
      ])
    );

    hasBasicValidationMock.mockRestore();
  });

  it("should call character validation for caster with failure", async () => {
    executeEffectMock.mockImplementation();

    const hasBasicValidationMock = jest.spyOn(CharacterValidation.prototype, "hasBasicValidation");

    // if hasBasicValidation returns false;
    hasBasicValidationMock.mockImplementation();
    hasBasicValidationMock.mockReturnValue(false);

    await useWithEntity.execute(
      {
        itemId: item1._id,
        entityId: targetCharacter._id,
        entityType: EntityType.Character,
      },
      testCharacter
    );

    expect(executeEffectMock).toBeCalledTimes(0);
    // is not called for target if caster validation fails
    expect(hasBasicValidationMock).toBeCalledTimes(1);
    expect(hasBasicValidationMock).toHaveBeenLastCalledWith(testCharacter);

    hasBasicValidationMock.mockRestore();
  });

  it("should call character validation for target with failure", async () => {
    executeEffectMock.mockImplementation();

    const hasBasicValidationMock = jest.spyOn(CharacterValidation.prototype, "hasBasicValidation");

    // if hasBasicValidation returns false;
    hasBasicValidationMock.mockImplementation();
    // success for caster but failure for target
    hasBasicValidationMock.mockReturnValueOnce(true).mockReturnValueOnce(false);

    await useWithEntity.execute(
      {
        itemId: item1._id,
        entityId: targetCharacter._id,
        entityType: EntityType.Character,
      },
      testCharacter
    );

    expect(executeEffectMock).toBeCalledTimes(0);
    // once for caster once for target
    expect(hasBasicValidationMock).toBeCalledTimes(2);

    hasBasicValidationMock.mockRestore();
  });

  it("should not call character validation for npc", async () => {
    executeEffectMock.mockImplementation();

    const hasBasicValidationMock = jest.spyOn(CharacterValidation.prototype, "hasBasicValidation");
    hasBasicValidationMock.mockImplementation();
    // fail validation if its called more than once
    hasBasicValidationMock.mockReturnValueOnce(true).mockReturnValueOnce(false);

    await useWithEntity.execute(
      {
        itemId: item1._id,
        entityId: testNPC._id,
        entityType: EntityType.NPC,
      },
      testCharacter
    );

    expect(executeEffectMock).toBeCalledTimes(1);
    // once for caster
    expect(hasBasicValidationMock).toBeCalledTimes(1);
  });

  it("should fail validation if target npc is not alive", async () => {
    executeEffectMock.mockImplementation();

    testNPC.health = 0;
    await testNPC.save();

    await useWithEntity.execute(
      {
        itemId: item1._id,
        entityId: testNPC._id,
        entityType: EntityType.NPC,
      },
      testCharacter
    );

    expect(executeEffectMock).toBeCalledTimes(0);
    expect(sendEventToUserMock).toBeCalledTimes(1);

    expect(sendEventToUserMock).toHaveBeenLastCalledWith(testCharacter.channelId, UISocketEvents.ShowMessage, {
      message: "Sorry, your target is dead.",
      type: "error",
    });
  });

  it("should fail validation if target is out of reach", async () => {
    executeEffectMock.mockImplementation();

    const isUnderRangeMock = jest.spyOn(MovementHelper.prototype, "isUnderRange");

    testNPC.x = testCharacter.x + (ITEM_USE_WITH_ENTITY_GRID_CELL_RANGE + 1) * GRID_WIDTH;
    testNPC.y = testCharacter.y;
    await testNPC.save();

    await useWithEntity.execute(
      {
        itemId: item1._id,
        entityId: testNPC._id,
        entityType: EntityType.NPC,
      },
      testCharacter
    );

    expect(executeEffectMock).toBeCalledTimes(0);
    expect(sendEventToUserMock).toBeCalledTimes(1);

    expect(sendEventToUserMock).toHaveBeenLastCalledWith(testCharacter.channelId, UISocketEvents.ShowMessage, {
      message: "Sorry, your taget is out of reach.",
      type: "error",
    });

    expect(isUnderRangeMock).toBeCalledTimes(1);
    expect(isUnderRangeMock).toHaveBeenLastCalledWith(
      testCharacter.x,
      testCharacter.y,
      testNPC.x,
      testNPC.y,
      ITEM_USE_WITH_ENTITY_GRID_CELL_RANGE
    );
  });

  it("should fail if item is not in inventory", async () => {
    executeEffectMock.mockImplementation();

    const isInInventoryMock = jest.spyOn(ItemValidation.prototype, "isItemInCharacterInventory");

    const darkRune = await unitTestHelper.createMockItemFromBlueprint(MagicsBlueprint.DarkRune);

    await useWithEntity.execute(
      {
        itemId: darkRune._id,
        entityId: targetCharacter._id,
        entityType: EntityType.Character,
      },
      testCharacter
    );

    expect(executeEffectMock).toBeCalledTimes(0);
    expect(sendEventToUserMock).toBeCalledTimes(1);

    expect(sendEventToUserMock).toHaveBeenLastCalledWith(testCharacter.channelId, UISocketEvents.ShowMessage, {
      message: "Sorry, you do not have this item in your inventory.",
      type: "error",
    });

    expect(isInInventoryMock).toBeCalledTimes(1);
    expect(isInInventoryMock).toHaveBeenLastCalledWith(testCharacter, darkRune._id);
  });

  it("should fail validation if character does not have required magic level", async () => {
    executeEffectMock.mockImplementation();

    characterSkills.magic.level = (itemDarkRune.minMagicLevelRequired ?? 0) - 1;
    await characterSkills.save();

    await useWithEntity.execute(
      {
        itemId: item1._id,
        entityId: targetCharacter._id,
        entityType: EntityType.Character,
      },
      testCharacter
    );

    expect(executeEffectMock).toBeCalledTimes(0);
    expect(sendEventToUserMock).toBeCalledTimes(1);

    expect(sendEventToUserMock).toHaveBeenLastCalledWith(testCharacter.channelId, UISocketEvents.ShowMessage, {
      message: `Sorry, '${itemDarkRune.name}' can not only be used with target at magic level '${itemDarkRune.minMagicLevelRequired}' or greater.`,
      type: "error",
    });
  });

  it("should fail validation if target is on different scene", async () => {
    executeEffectMock.mockImplementation();

    targetCharacter.scene = testCharacter.scene + "-2";
    await targetCharacter.save();

    await useWithEntity.execute(
      {
        itemId: item1._id,
        entityId: targetCharacter._id,
        entityType: EntityType.Character,
      },
      testCharacter
    );

    expect(executeEffectMock).toBeCalledTimes(0);
    expect(sendEventToUserMock).toBeCalledTimes(1);

    expect(sendEventToUserMock).toHaveBeenLastCalledWith(testCharacter.channelId, UISocketEvents.ShowMessage, {
      message: "Sorry, your target is not on the same scene.",
      type: "error",
    });
  });

  it("should successfully use dark rune on target character", async () => {
    await useWithEntity.execute(
      {
        itemId: item1._id,
        entityId: targetCharacter._id,
        entityType: EntityType.Character,
      },
      testCharacter
    );

    const target = (await Character.findOne({ _id: targetCharacter._id })) as unknown as ICharacter;
    expect(target.health).toBe(100);
    expect(target.mana).toBe(90);
  });

  it("should successfully use poison rune on target character", async () => {
    const items = [await unitTestHelper.createMockItemFromBlueprint(MagicsBlueprint.PoisonRune)];

    await unitTestHelper.addItemsToInventoryContainer(inventoryContainer, 6, items);

    await useWithEntity.execute(
      {
        itemId: items[0]._id,
        entityId: targetCharacter._id,
        entityType: EntityType.Character,
      },
      testCharacter
    );

    const target = (await Character.findOne({ _id: targetCharacter._id })) as unknown as ICharacter;
    expect(target.health).toBe(90);
    expect(target.mana).toBe(100);
  });

  it("should successfully use fire rune on target character", async () => {
    const items = [await unitTestHelper.createMockItemFromBlueprint(MagicsBlueprint.FireRune)];

    await unitTestHelper.addItemsToInventoryContainer(inventoryContainer, 6, items);

    await useWithEntity.execute(
      {
        itemId: items[0]._id,
        entityId: targetCharacter._id,
        entityType: EntityType.Character,
      },
      testCharacter
    );

    const target = (await Character.findOne({ _id: targetCharacter._id })) as unknown as ICharacter;
    expect(target.health).toBe(90);
    expect(target.mana).toBe(100);
  });

  it("should successfully use heal rune on target character", async () => {
    const items = [await unitTestHelper.createMockItemFromBlueprint(MagicsBlueprint.HealRune)];

    await unitTestHelper.addItemsToInventoryContainer(inventoryContainer, 6, items);

    targetCharacter.health = 50;
    await targetCharacter.save();

    await useWithEntity.execute(
      {
        itemId: items[0]._id,
        entityId: targetCharacter._id,
        entityType: EntityType.Character,
      },
      testCharacter
    );

    const target = (await Character.findOne({ _id: targetCharacter._id })) as unknown as ICharacter;
    expect(target.health).toBe(60);
    expect(target.mana).toBe(100);
  });

  it("should deal extra damage depending on magic level", async () => {
    characterSkills.magic.level = 12;
    await characterSkills.save();

    await useWithEntity.execute(
      {
        itemId: item1._id,
        entityId: targetCharacter._id,
        entityType: EntityType.Character,
      },
      testCharacter
    );

    const target = (await Character.findOne({ _id: targetCharacter._id })) as unknown as ICharacter;
    expect(target.health).toBe(100);
    expect(target.mana).toBe(89);
  });

  it("should successfully use fire rune on target npc", async () => {
    const items = [await unitTestHelper.createMockItemFromBlueprint(MagicsBlueprint.FireRune)];

    await unitTestHelper.addItemsToInventoryContainer(inventoryContainer, 6, items);

    await useWithEntity.execute(
      {
        itemId: items[0]._id,
        entityId: testNPC._id,
        entityType: EntityType.NPC,
      },
      testCharacter
    );

    const target = (await NPC.findOne({ _id: testNPC._id })) as unknown as INPC;
    expect(target.health).toBe(90);
  });

  afterAll(async () => {
    /**
     * CharacterView.getOtherElementsInView when used with .lean({virtuals true})
     * causes a little slow down and if we close the connection right after the test
     * the test starts failing with connection closed error
     */
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 500);
    });

    await unitTestHelper.afterAllJestHook();
  });
});
