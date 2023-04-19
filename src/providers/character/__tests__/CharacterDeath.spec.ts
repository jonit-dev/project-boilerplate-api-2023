import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment, IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { DROP_EQUIPMENT_CHANCE } from "@providers/constants/DeathConstants";
import { container, unitTestHelper } from "@providers/inversify/container";
import { AccessoriesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { NPCBattleCycle, NPC_BATTLE_CYCLES } from "@providers/npc/NPCBattleCycle";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import _ from "lodash";
import { CharacterDeath } from "../CharacterDeath";
import { CharacterWeapon } from "../CharacterWeapon";

jest.mock("@providers/constants/DeathConstants", () => ({
  DROP_EQUIPMENT_CHANCE: 15,
}));

describe("CharacterDeath.ts", () => {
  let characterDeath: CharacterDeath;
  let testCharacter: ICharacter;
  let testNPC: INPC;

  beforeAll(() => {
    jest.useFakeTimers({
      advanceTimers: true,
    });

    characterDeath = container.get<CharacterDeath>(CharacterDeath);
  });

  beforeEach(async () => {
    testNPC = await unitTestHelper.createMockNPC();
    testCharacter = await unitTestHelper.createMockCharacter(null, {
      hasEquipment: true,
      hasInventory: true,
      hasSkills: true,
    });
  });

  it("should properly generate a character body on death", async () => {
    await characterDeath.handleCharacterDeath(testNPC, testCharacter);

    const charBody = await Item.findOne({
      owner: testCharacter._id,
    });

    expect(charBody).toBeDefined();
  });

  it("attacker's targeting should be properly cleared after character death", async () => {
    testNPC.targetCharacter = testCharacter._id;
    await testNPC.save();
    new NPCBattleCycle(testNPC.id, () => {}, 10000);

    await characterDeath.handleCharacterDeath(testNPC, testCharacter);

    const updatedNPC = await NPC.findById(testNPC.id);
    expect(updatedNPC?.targetCharacter).toBeUndefined();

    const npcBattleCycle = NPC_BATTLE_CYCLES.get(testNPC.id);

    expect(npcBattleCycle).toBeUndefined();
  });

  it("should respawn a character after its death", async () => {
    await characterDeath.handleCharacterDeath(testNPC, testCharacter);

    const postDeathCharacter = await Character.findById(testCharacter._id);

    if (!postDeathCharacter) {
      throw new Error("Character not found");
    }

    expect(postDeathCharacter.health === postDeathCharacter.maxHealth).toBeTruthy();
    expect(postDeathCharacter.mana === postDeathCharacter.maxMana).toBeTruthy();
    expect(postDeathCharacter.x === postDeathCharacter.initialX).toBeTruthy();
    expect(postDeathCharacter.y === postDeathCharacter.initialY).toBeTruthy();
    expect(postDeathCharacter.scene === postDeathCharacter.initialScene).toBeTruthy();
  });

  it("should properly warn characters around, about character's death", async () => {
    // @ts-ignore
    const spySocketMessaging = jest.spyOn(characterDeath.socketMessaging, "sendEventToUser");

    await characterDeath.handleCharacterDeath(testNPC, testCharacter);

    expect(spySocketMessaging).toHaveBeenCalled();
  });
  it("should clear all entity effects on character's death", async () => {
    // @ts-ignore
    const clearEffectsSpy = jest.spyOn(characterDeath.entityEffectUse, "clearAllEntityEffects");

    await characterDeath.handleCharacterDeath(testNPC, testCharacter);

    expect(clearEffectsSpy).toHaveBeenCalled();
    expect(clearEffectsSpy).toHaveBeenCalledWith(testCharacter);
  });
});

describe("CharacterDeath.ts | Character with items", () => {
  let characterDeath: CharacterDeath;
  let testCharacter: ICharacter;
  let backpackContainer: IItemContainer;
  let characterEquipment: IEquipment;
  let testNPC: INPC;
  let characterWeapon: CharacterWeapon;

  beforeAll(() => {
    characterDeath = container.get<CharacterDeath>(CharacterDeath);

    characterWeapon = container.get<CharacterWeapon>(CharacterWeapon);

    jest.useFakeTimers({
      advanceTimers: true,
    });

    // @ts-ignore
    jest.spyOn(characterDeath.characterDeathCalculator, "calculateInventoryDropChance").mockImplementation(() => 100);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    testNPC = await unitTestHelper.createMockNPC();
    testCharacter = await unitTestHelper.createMockCharacter(null, {
      hasEquipment: true,
      hasInventory: true,
      hasSkills: true,
    });

    characterEquipment = (await Equipment.findById(testCharacter.equipment).populate("inventory").exec()) as IEquipment;

    // Add items to character's equipment
    const equipment = await unitTestHelper.createEquipment();
    characterEquipment.head = equipment.neck;
    characterEquipment.neck = equipment.head;
    characterEquipment.leftHand = equipment.leftHand;
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should drop character's backpack items as a container on its dead body", async () => {
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

    // body should have the only one item
    expect(characterBody!.itemContainer).toBeDefined();
    expect(bodyItemContainer.slots).toBeDefined();

    expect(bodyItemContainer.slots[0].key).toBe("backpack");

    // backpack ownership should be null after death
    expect(bodyItemContainer.slots[0].owner).toBeUndefined();

    const updatedBody = await Item.findById(characterBody!._id);
    expect(updatedBody?.isDeadBodyLootable).toBe(true);
  });

  it("should drop equipment item on character's dead body", async () => {
    // @ts-ignore
    const characterBody = (await characterDeath.generateCharacterBody(testCharacter)) as IItem;

    let bodyItemContainer = (await ItemContainer.findById(characterBody.itemContainer)) as IItemContainer;

    // character is equipped with 2 items (head and neck)
    expect(characterEquipment.neck).toBeDefined();
    expect(characterEquipment.head).toBeDefined();
    // call 3 times the dropEquippedItemOnBody with 100% chance
    // of dropping the items to drop both of them
    // and make one extra call that should not add anything to the body container
    for (let i = 0; i < 3; i++) {
      // mock lodash random to always return 100
      jest.spyOn(_, "random").mockImplementation(() => DROP_EQUIPMENT_CHANCE);

      // @ts-ignore
      await characterDeath.dropEquippedItemOnBody(testCharacter, bodyItemContainer, characterEquipment);
    }

    const updatedEquipment = (await Equipment.findById(characterEquipment._id)) as IEquipment;

    // character equipment is empty
    expect(updatedEquipment.neck).not.toBeDefined();
    expect(updatedEquipment.head).not.toBeDefined();

    bodyItemContainer = (await ItemContainer.findById(characterBody.itemContainer)) as IItemContainer;

    // dead body contains the items
    expect(bodyItemContainer!.slots).toBeDefined();
    expect(bodyItemContainer!.slots[0]).not.toBeNull();
    expect(bodyItemContainer!.slots[1]).not.toBeNull();
    expect(bodyItemContainer!.slots[2]).not.toBeNull();

    const updatedBody = await Item.findById(characterBody._id);
    expect(updatedBody?.isDeadBodyLootable).toBe(true);
  });

  it("should update the attack type after dead and drop Bow, Ranged to Melee", async () => {
    // @ts-ignore
    const characterBody = (await characterDeath.generateCharacterBody(testCharacter)) as IItem;
    const bodyItemContainer = (await ItemContainer.findById(characterBody.itemContainer)) as IItemContainer;

    expect(characterEquipment.leftHand).toBeDefined();

    const characterAttackTypeBeforeEquip = await Character.findById({ _id: testCharacter._id });

    if (!characterAttackTypeBeforeEquip) throw new Error("Character not found");

    const attackType = await characterWeapon.getAttackType(characterAttackTypeBeforeEquip);

    expect(attackType).toEqual(EntityAttackType.Ranged);

    for (let i = 0; i < 3; i++) {
      jest.spyOn(_, "random").mockImplementation(() => DROP_EQUIPMENT_CHANCE);
      // @ts-ignore
      await characterDeath.dropEquippedItemOnBody(testCharacter, bodyItemContainer, characterEquipment);
    }

    const updatedEquipment = (await Equipment.findById(characterEquipment._id)) as IEquipment;

    expect(updatedEquipment.leftHand).not.toBeDefined();

    const characterAttackTypeAfterEquip = await Character.findById({ _id: testCharacter._id });

    if (!characterAttackTypeAfterEquip) throw new Error("Character not found");

    const attackTypeAfterEquip = await characterWeapon.getAttackType(characterAttackTypeAfterEquip);

    expect(attackTypeAfterEquip).toEqual(EntityAttackType.Melee);
  });

  describe("Amulet of Death", () => {
    let dropCharacterItemsOnBodySpy: jest.SpyInstance;

    beforeEach(() => {
      jest.clearAllMocks();

      // @ts-ignore
      dropCharacterItemsOnBodySpy = jest.spyOn(characterDeath, "dropCharacterItemsOnBody");
    });

    const equipAmuletOfDeath = async (): Promise<void> => {
      const amuletOfDeath = await unitTestHelper.createMockItemFromBlueprint(AccessoriesBlueprint.AmuletOfDeath);

      const equipment = await Equipment.findById(testCharacter.equipment);

      if (!equipment) throw new Error("Equipment not found");

      equipment.neck = amuletOfDeath._id;

      await equipment.save();
    };

    it("If the character has an amulet of death, it should not drop any items", async () => {
      await equipAmuletOfDeath();

      await characterDeath.handleCharacterDeath(testNPC, testCharacter);

      expect(dropCharacterItemsOnBodySpy).not.toHaveBeenCalled();
    });

    it("If the character has NO amulet of death, it should drop items", async () => {
      await characterDeath.handleCharacterDeath(testNPC, testCharacter);

      expect(dropCharacterItemsOnBodySpy).toHaveBeenCalled();
    });

    it("Should remove the amulet of death, if we die with it", async () => {
      await equipAmuletOfDeath();

      await characterDeath.handleCharacterDeath(testNPC, testCharacter);

      const equipment = await Equipment.findById(testCharacter.equipment);

      if (!equipment) throw new Error("Equipment not found");

      expect(equipment.neck).toBeUndefined();
    });
  });
});
