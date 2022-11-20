/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { MagicsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { CharacterSocketEvents, UISocketEvents } from "@rpg-engine/shared";
import { EntityType } from "@rpg-engine/shared/dist/types/entity.types";
import { UseWithEntity } from "../UseWithEntity";

describe("UseWithEntity.ts", () => {
  let useWithEntity: UseWithEntity;
  let testCharacter: ICharacter;
  let targetCharacter: ICharacter;
  let item1: IItem;
  let inventory: IItem;
  let inventoryContainer: IItemContainer;
  let sendGenericErrorMessage: jest.SpyInstance;

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
    testCharacter = await unitTestHelper.createMockCharacter(
      {
        x: 10,
        y: 11,
      },
      { hasEquipment: true, hasInventory: true, hasSkills: true }
    );

    targetCharacter = await unitTestHelper.createMockCharacter(
      {
        x: 11,
        y: 12,
      },
      { hasEquipment: true, hasInventory: true, hasSkills: true }
    );

    inventory = await testCharacter.inventory;
    inventoryContainer = (await ItemContainer.findById(inventory.itemContainer)) as unknown as IItemContainer;

    await addItemsToInventory();
  };

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);
    await prepareData();

    sendGenericErrorMessage = jest.spyOn(SocketMessaging.prototype, "sendEventToUser");
  });

  it("should call execute effect", async () => {
    await useWithEntity.execute(
      {
        itemId: item1._id,
        entityId: targetCharacter._id,
        entityType: EntityType.Character,
      },
      testCharacter
    );
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
