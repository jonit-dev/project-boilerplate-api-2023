import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill } from "@entities/ModuleCharacter/SkillsModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { CharacterItemContainer } from "@providers/character/characterItems/CharacterItemContainer";
import { container, unitTestHelper } from "@providers/inversify/container";
import { MagicsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";

import { SpellItemCreation } from "../data/abstractions/SpellItemCreation";
import { spellArrowCreation } from "../data/blueprints/SpellArrowCreation";
import { spellBlankRuneCreation } from "../data/blueprints/SpellBlankRuneCreation";
import { spellBoltCreation } from "../data/blueprints/SpellBoltCreation";
import { spellDarkRuneCreation } from "../data/blueprints/SpellDarkRuneCreation";
import { spellFireRuneCreation } from "../data/blueprints/SpellFireRuneCreation";
import { spellFoodCreation } from "../data/blueprints/SpellFoodCreation";
import { spellHealRuneCreation } from "../data/blueprints/SpellHealRuneCreation";
import { spellPoisonRuneCreation } from "../data/blueprints/SpellPoisonRuneCreation";
import { spellSelfHealing } from "../data/blueprints/SpellSelfHealing";

describe("SpellItemCreation", () => {
  let testCharacter: ICharacter;
  let characterSkills: ISkill;
  let sendErrorMessageToCharacter: jest.SpyInstance;
  let sendInventoryUpdateEvent: jest.SpyInstance;
  let inventory: IItem;
  let inventoryContainer: IItemContainer;

  let spellItemCreation: SpellItemCreation;

  let characterItemContainer: CharacterItemContainer;

  const level2Spells = [
    spellSelfHealing,
    spellFoodCreation,
    spellArrowCreation,
    spellBoltCreation,
    spellBlankRuneCreation,
    spellFireRuneCreation,
    spellHealRuneCreation,
    spellDarkRuneCreation,
    spellPoisonRuneCreation,
  ];

  beforeAll(async () => {
    spellItemCreation = container.get(SpellItemCreation);
    characterItemContainer = container.get(CharacterItemContainer);
  });

  beforeEach(async () => {
    // @ts-ignore
    sendErrorMessageToCharacter = jest.spyOn(spellItemCreation.socketMessaging, "sendErrorMessageToCharacter");

    // @ts-ignore
    sendInventoryUpdateEvent = jest.spyOn(spellItemCreation.characterInventory, "sendInventoryUpdateEvent");

    testCharacter = await unitTestHelper.createMockCharacter(
      { health: 50, learnedSpells: level2Spells.map((spell) => spell.key) },
      { hasEquipment: true, hasInventory: true, hasSkills: true }
    );

    await testCharacter.populate("skills").execPopulate();

    characterSkills = testCharacter.skills as unknown as ISkill;
    characterSkills.level = 999;
    characterSkills.magic.level = 999;
    await characterSkills.save();

    inventory = await testCharacter.inventory;
    inventoryContainer = (await ItemContainer.findById(inventory.itemContainer)) as unknown as IItemContainer;

    jest.clearAllMocks();
  });

  const addBlankRune = async (): Promise<void> => {
    const items = [await unitTestHelper.createMockItemFromBlueprint(MagicsBlueprint.Rune)];
    await unitTestHelper.addItemsToInventoryContainer(inventoryContainer, 6, items);
  };

  it("should cast rune creation spell successfully", async () => {
    await addBlankRune();

    const result = await spellItemCreation.createItem(testCharacter, {
      itemToCreate: {
        key: MagicsBlueprint.DarkRune,
      },
      itemToConsume: {
        key: MagicsBlueprint.Rune,
        onErrorMessage: "You do not have any blank rune to create a Dark Rune.",
      },
    });

    expect(result).toBe(true);

    expect(sendErrorMessageToCharacter).not.toHaveBeenCalled();
    expect(sendInventoryUpdateEvent).toHaveBeenCalled();
  });

  it("fails if we try to create an item without the itemToConsume", async () => {
    await characterItemContainer.clearAllSlots(inventoryContainer);

    const result = await spellItemCreation.createItem(testCharacter, {
      itemToCreate: {
        key: MagicsBlueprint.DarkRune,
      },
      itemToConsume: {
        key: MagicsBlueprint.Rune,
        onErrorMessage: "You do not have any blank rune to create a Dark Rune.",
      },
    });

    expect(result).toBe(false);

    expect(sendErrorMessageToCharacter).toHaveBeenCalled();
    expect(sendInventoryUpdateEvent).not.toHaveBeenCalled();

    expect(sendErrorMessageToCharacter).toHaveBeenCalledWith(
      testCharacter,
      "You do not have any blank rune to create a Dark Rune."
    );
  });
  afterAll(async () => {
    jest.clearAllMocks();
    await unitTestHelper.afterAllJestHook();
  });
});
