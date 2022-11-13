import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { User } from "@entities/ModuleSystem/UserModel";
import { CharacterItems } from "@providers/character/characterItems/CharacterItems";
import { container, unitTestHelper } from "@providers/inversify/container";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { Types } from "mongoose";
import { Equipment, IEquipment } from "../EquipmentModel";
import { Skill } from "../SkillsModel";

describe("CharacterModel.ts", () => {
  let testCharacter: ICharacter;
  // eslint-disable-next-line no-unused-vars
  let characterItems: CharacterItems;
  // eslint-disable-next-line no-unused-vars
  let testItem: IItem;
  // eslint-disable-next-line no-unused-vars
  let inventoryItemContainerId: string;
  let characterEquipment: IEquipment;
  let inventory: IItem;
  let bowItem: IItem;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();
    characterItems = container.get<CharacterItems>(CharacterItems);
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);

    testCharacter = await (
      await unitTestHelper.createMockCharacter(null, {
        hasEquipment: true,
        hasInventory: true,
        hasSkills: true,
      })
    )
      .populate("skills")
      .execPopulate();

    testItem = await unitTestHelper.createMockItem({
      x: testCharacter.x,
      y: testCharacter.y,
      scene: testCharacter.scene,
      weight: 0,
    });

    inventory = await testCharacter.inventory;
    inventoryItemContainerId = inventory.itemContainer as unknown as string;
    characterEquipment = (await Equipment.findById(testCharacter.equipment).populate("inventory").exec()) as IEquipment;

    const bow = itemsBlueprintIndex[RangedWeaponsBlueprint.Bow];
    bowItem = new Item({ ...bow });
    const res = await bowItem.save();

    characterEquipment!.rightHand = res._id as Types.ObjectId | undefined;
    await characterEquipment!.save();
  });

  it("should properly remove the Character", async () => {
    const result = await testCharacter
      .remove()
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });

    expect(result).toBeTruthy();

    const characterAfterDelete = await Character.findOne({ _id: testCharacter._id });
    expect(characterAfterDelete).toBeNull();
  });

  it("should properly remove the Character and Check Database", async () => {
    const result = await testCharacter
      .remove()
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });

    expect(result).toBeTruthy();

    const characterAfterDelete = await Character.find({ _id: testCharacter._id });
    expect(characterAfterDelete).toHaveLength(0);

    const inventoryAfterDelete = await ItemContainer.find({ owner: testCharacter._id });
    expect(inventoryAfterDelete).toHaveLength(0);

    const skillAfterDelete = await Skill.find({ _id: testCharacter.skills });
    expect(skillAfterDelete).toHaveLength(0);

    const itemsAfterDelete = await Item.find({ owner: testCharacter._id });
    expect(itemsAfterDelete).toHaveLength(0);
  });

  it("should properly remove the Character and All Itens", async () => {
    const itemBeforeDelete = await Item.findOne({ owner: testCharacter._id });
    expect(itemBeforeDelete).toBeDefined();

    const result = await testCharacter
      .remove()
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });

    expect(result).toBeTruthy();

    const itemAfterDelete = await Item.findOne({ owner: testCharacter._id });
    expect(itemAfterDelete).toBeNull();

    const characterAfterDelete = await Character.findOne({ _id: testCharacter._id });
    expect(characterAfterDelete).toBeNull();
  });

  it("should properly remove the Character and Skills", async () => {
    const skillBeforeDelete = await Skill.findOne({ _id: testCharacter.skills });
    expect(skillBeforeDelete).toBeDefined();

    const result = await testCharacter
      .remove()
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });

    expect(result).toBeTruthy();

    const skillAfterDelete = await Skill.findOne({ _id: testCharacter.skills });
    expect(skillAfterDelete).toBeNull();

    const characterAfterDelete = await Character.findOne({ _id: testCharacter._id });
    expect(characterAfterDelete).toBeNull();
  });

  it("should properly remove the Character and Equipment", async () => {
    const equipmentBeforeDelete = await Equipment.findOne({ owner: testCharacter._id });
    expect(equipmentBeforeDelete).toBeDefined();

    const result = await testCharacter
      .remove()
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });

    expect(result).toBeTruthy();

    const equipmentAfterDelete = await Equipment.findOne({ owner: testCharacter._id });
    expect(equipmentAfterDelete).toBeNull();

    const characterAfterDelete = await Character.findOne({ _id: testCharacter._id });
    expect(characterAfterDelete).toBeNull();
  });

  it("should properly remove the Character and Item Container", async () => {
    const inventoryBeforeDelete = await ItemContainer.findOne({ owner: testCharacter._id });
    expect(inventoryBeforeDelete).toBeDefined();

    const result = await testCharacter
      .remove()
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });

    expect(result).toBeTruthy();

    const inventoryAfterDelete = await ItemContainer.findOne({ owner: testCharacter._id });
    expect(inventoryAfterDelete).toBeNull();

    const characterAfterDelete = await Character.findOne({ _id: testCharacter._id });
    expect(characterAfterDelete).toBeNull();
  });

  it("should properly remove the Character and CharacterId on User", async () => {
    const result = await testCharacter
      .remove()
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });

    expect(result).toBeTruthy();

    const characterAfterDelete = await User.find({ characters: testCharacter._id });
    expect(characterAfterDelete).toHaveLength(0);
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
