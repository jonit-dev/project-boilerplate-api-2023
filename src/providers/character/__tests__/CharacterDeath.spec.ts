import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment, IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { DROP_EQUIPMENT_CHANCE } from "@providers/constants/DeathConstants";
import { container, entityEffectUse, unitTestHelper } from "@providers/inversify/container";
import { AccessoriesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { NPCBattleCycle, NPC_BATTLE_CYCLES } from "@providers/npc/NPCBattleCycle";
import { CharacterSkullType, Modes } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import _ from "lodash";
import { CharacterDeath } from "../CharacterDeath";
import { CharacterWeapon } from "../CharacterWeapon";

jest.mock("@providers/constants/DeathConstants", () => ({
  DROP_EQUIPMENT_CHANCE: 15,
}));

jest.useFakeTimers({
  advanceTimers: true,
});

describe("CharacterDeath.ts", () => {
  let characterDeath: CharacterDeath;
  let testCharacter: ICharacter;
  let testNPC: INPC;

  beforeAll(() => {
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

  it("should properly handle character's death main points", async () => {
    testNPC.targetCharacter = testCharacter._id;
    await testNPC.save();
    new NPCBattleCycle(testNPC.id, () => {}, 10000);

    // @ts-ignore
    const spySocketMessaging = jest.spyOn(characterDeath.socketMessaging, "sendEventToUser");
    // @ts-ignore
    const clearEffectsSpy = jest.spyOn(entityEffectUse, "clearAllEntityEffects");

    await characterDeath.handleCharacterDeath(testNPC, testCharacter);

    //* Generate a body
    const charBody = await Item.findOne({
      owner: testCharacter._id,
    });
    expect(charBody).toBeDefined();

    //* warn characters around about death
    expect(spySocketMessaging).toHaveBeenCalled();

    //* clear attacker's target
    const updatedNPC = await NPC.findById(testNPC.id);
    expect(updatedNPC?.targetCharacter).toBeUndefined();

    const npcBattleCycle = NPC_BATTLE_CYCLES.get(testNPC.id);

    expect(npcBattleCycle).toBeUndefined();

    //* respawn a character
    const postDeathCharacter = await Character.findById(testCharacter._id);

    if (!postDeathCharacter) {
      throw new Error("Character not found");
    }

    expect(postDeathCharacter.health === postDeathCharacter.maxHealth).toBeTruthy();
    expect(postDeathCharacter.mana === postDeathCharacter.maxMana).toBeTruthy();
    expect(postDeathCharacter.x === postDeathCharacter.initialX).toBeTruthy();
    expect(postDeathCharacter.y === postDeathCharacter.initialY).toBeTruthy();
    expect(postDeathCharacter.scene === postDeathCharacter.initialScene).toBeTruthy();
    expect(postDeathCharacter.appliedEntityEffects).toHaveLength(0);

    // * Clear all effects
    expect(clearEffectsSpy).toHaveBeenCalled();
    expect(clearEffectsSpy).toHaveBeenCalledWith(testCharacter);
  });

  describe("Soft mode", () => {
    let characterDeath: CharacterDeath;
    let testCharacter: ICharacter;
    let testNPC: INPC;
    beforeAll(() => {
      characterDeath = container.get<CharacterDeath>(CharacterDeath);
    });

    beforeEach(async () => {
      testCharacter = await unitTestHelper.createMockCharacter({
        mode: Modes.SoftMode,
      });
    });

    it("should not apply penalties for character on soft mode", async () => {
      // @ts-ignore
      const spyDropCharacterItemsOnBody = jest.spyOn(characterDeath, "dropCharacterItemsOnBody");
      // @ts-ignore
      const spyPenalties = jest.spyOn(characterDeath, "applyPenalties");

      // character dies
      await characterDeath.handleCharacterDeath(testNPC, testCharacter);

      expect(spyDropCharacterItemsOnBody).not.toHaveBeenCalled();
      expect(spyPenalties).not.toHaveBeenCalled();
    });
  });

  describe("Soft mode with skull penalty", () => {
    let characterDeath: CharacterDeath;
    let testCharacter: ICharacter;
    let testNPC: INPC;
    beforeAll(() => {
      characterDeath = container.get<CharacterDeath>(CharacterDeath);
    });

    beforeEach(async () => {
      testCharacter = await unitTestHelper.createMockCharacter({
        mode: Modes.SoftMode,
        hasSkull: true,
        skullType: CharacterSkullType.WhiteSkull,
      });
    });

    it("should apply penalties for character even on soft mode", async () => {
      // @ts-ignore
      const spyDropCharacterItemsOnBody = jest.spyOn(characterDeath, "dropCharacterItemsOnBody");
      // @ts-ignore
      const spyPenalties = jest.spyOn(characterDeath, "applyPenalties");

      // character dies
      await characterDeath.handleCharacterDeath(testNPC, testCharacter);

      expect(spyDropCharacterItemsOnBody).toHaveBeenCalled();
      expect(spyPenalties).toHaveBeenCalled();
    });
  });

  describe("Permadeath Mode", () => {
    let characterDeath: CharacterDeath;
    let testCharacter: ICharacter;
    let testNPC: INPC;

    beforeAll(() => {
      characterDeath = container.get<CharacterDeath>(CharacterDeath);
    });

    beforeEach(async () => {
      testNPC = await unitTestHelper.createMockNPC();
      testCharacter = await unitTestHelper.createMockCharacter({
        mode: Modes.PermadeathMode,
        isSoftDelete: false,
      });
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should enable isSoftDelete on a character playing on permadeath mode, after death, and drop all loop", async () => {
      // @ts-ignore
      const spyOnPermaDeathTrigger = jest.spyOn(characterDeath, "softDeleteCharacterOnPermaDeathMode");
      // @ts-ignore
      const spyApplyPenalties = jest.spyOn(characterDeath, "applyPenalties");

      await characterDeath.handleCharacterDeath(testNPC, testCharacter);

      const postDeathCharacter = await Character.findById(testCharacter._id).lean();

      if (!postDeathCharacter) {
        throw new Error("Character not found");
      }

      expect(spyOnPermaDeathTrigger).toHaveBeenCalled();

      expect(postDeathCharacter.isSoftDeleted).toBeTruthy();

      expect(spyApplyPenalties).toHaveBeenCalledWith(testCharacter, expect.anything(), true);
    });
  });

  describe("Hardcore mode", () => {
    let testCharacter: ICharacter;
    let backpackContainer: IItemContainer;
    let characterEquipment: IEquipment;
    let testNPC: INPC;
    let characterWeapon: CharacterWeapon;

    beforeAll(() => {
      characterWeapon = container.get<CharacterWeapon>(CharacterWeapon);

      // @ts-ignore
      jest.spyOn(characterDeath.characterDeathCalculator, "calculateInventoryDropChance").mockImplementation(() => 100);
    });

    beforeEach(async () => {
      testNPC = await unitTestHelper.createMockNPC();
      testCharacter = await unitTestHelper.createMockCharacter(
        {
          mode: Modes.HardcoreMode,
        },
        {
          hasEquipment: true,
          hasInventory: true,
          hasSkills: true,
        }
      );

      characterEquipment = (await Equipment.findById(testCharacter.equipment)
        .populate("inventory")
        .exec()) as IEquipment;

      // Add items to character's equipment
      const equipment = await unitTestHelper.createEquipment();
      characterEquipment.head = equipment.neck;
      characterEquipment.neck = equipment.head;
      characterEquipment.leftHand = equipment.leftHand;
      await characterEquipment.save();

      // Add items to character's backpack
      const backpack = characterEquipment.inventory as unknown as IItem;
      backpackContainer = await unitTestHelper.createMockBackpackItemContainer(backpack, {
        owner: testCharacter._id,
        carrier: testCharacter._id,
      });

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

    it("should drop character's backpack items as a container on its dead body, clear items properly", async () => {
      // @ts-ignore
      const spyDropCharacterItemsOnBody = jest.spyOn(characterDeath, "dropCharacterItemsOnBody");

      // initially, character's backpack has 2 items
      expect(backpackContainer?.slots[0]).not.toBeNull();
      expect(backpackContainer?.slots[1]).not.toBeNull();

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

      const hasBackpack = Object.values(bodyItemContainer.slots).some((slot: IItem) => slot.key === "backpack");

      expect(hasBackpack).toBeTruthy();

      const updatedBody = await Item.findById(characterBody!._id).lean();

      expect(updatedBody?.owner).toBeUndefined();

      expect(updatedBody?.isDeadBodyLootable).toBe(true);

      const droppedBackpack = bodyItemContainer.slots[0] as unknown as IItem;

      const updatedBackpackContainer = await ItemContainer.findById(droppedBackpack.itemContainer).lean();

      const droppedItem1 = await Item.findById(updatedBackpackContainer?.slots[0]._id).lean();
      const droppedItem2 = await Item.findById(updatedBackpackContainer?.slots[1]._id).lean();
      const droppedBPItem = await Item.findById(droppedBackpack?._id).lean();

      expect(droppedItem1?.owner).toBeUndefined();
      expect(droppedItem2?.owner).toBeUndefined();
      expect(droppedBPItem?.owner).toBeUndefined();
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

      let characterDropItem;

      for (let i = 0; i < 3; i++) {
        jest.spyOn(_, "random").mockImplementation(() => DROP_EQUIPMENT_CHANCE);
        // @ts-ignore
        // eslint-disable-next-line no-unused-vars
        characterDropItem = await characterDeath.dropEquippedItemOnBody(
          testCharacter,
          bodyItemContainer,
          characterEquipment
        );
      }

      if (characterDropItem) {
        const updatedEquipment = (await Equipment.findById(characterEquipment._id)) as IEquipment;

        expect(updatedEquipment.leftHand).not.toBeDefined();

        const characterAttackTypeAfterEquip = await Character.findById({ _id: testCharacter._id });

        if (!characterAttackTypeAfterEquip) throw new Error("Character not found");

        const attackTypeAfterEquip = await characterWeapon.getAttackType(characterAttackTypeAfterEquip);

        expect(attackTypeAfterEquip).toEqual(EntityAttackType.Melee);
      }
    });

    describe("Amulet of Death", () => {
      let dropCharacterItemsOnBodySpy: jest.SpyInstance;

      beforeEach(async () => {
        jest.clearAllMocks();

        // @ts-ignore
        dropCharacterItemsOnBodySpy = jest.spyOn(characterDeath, "dropCharacterItemsOnBody");

        testCharacter.mode = Modes.HardcoreMode;
        await testCharacter.save();
      });

      const equipAmuletOfDeath = async (): Promise<void> => {
        const amuletOfDeath = await unitTestHelper.createMockItemFromBlueprint(AccessoriesBlueprint.AmuletOfDeath);

        const equipment = await Equipment.findById(testCharacter.equipment);

        if (!equipment) throw new Error("Equipment not found");

        equipment.neck = amuletOfDeath._id;

        await equipment.save();
      };

      it("If the character has an amulet of death, it should not drop any items, but the amulet should be removed", async () => {
        await equipAmuletOfDeath();

        await characterDeath.handleCharacterDeath(testNPC, testCharacter);

        expect(dropCharacterItemsOnBodySpy).not.toHaveBeenCalled();

        const equipment = await Equipment.findById(testCharacter.equipment);

        if (!equipment) throw new Error("Equipment not found");

        expect(equipment.neck).toBeUndefined();
      });

      it("If the character has NO amulet of death, it should drop items", async () => {
        await characterDeath.handleCharacterDeath(testNPC, testCharacter);

        expect(dropCharacterItemsOnBodySpy).toHaveBeenCalled();
      });
    });
  });
});
