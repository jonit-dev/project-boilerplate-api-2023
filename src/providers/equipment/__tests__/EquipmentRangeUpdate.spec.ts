import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment, IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { unitTestHelper } from "@providers/inversify/container";
import { rangedWeaponsBlueprintIndex } from "@providers/item/data/blueprints/ranged-weapons/index";
import { RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";

describe("EquipmentRangeUpdate.spec.ts", () => {
  let item: IItem;
  let character: ICharacter;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);

    item = (await unitTestHelper.createMockItem()) as unknown as IItem;
    character = await unitTestHelper.createMockCharacter(null, { hasEquipment: true });
  });

  it("should properly detect melee equipped items", async () => {
    await equipItem(item, character, "leftHand");

    const updatedCharacter = await Character.findById(character._id);

    if (!updatedCharacter) {
      throw new Error("Character not found");
    }

    expect(await updatedCharacter.attackType).toBe(EntityAttackType.Melee);
  });

  it("should properly detect a ranged equipped item", async () => {
    const bow = await createItemBow();

    await equipItem(bow, character, "leftHand");

    const updatedCharacter = await Character.findById(character._id);

    if (!updatedCharacter) {
      throw new Error("Character not found");
    }

    expect(await updatedCharacter.attackType).toBe(EntityAttackType.Ranged);
  });

  it("should properly detect a hybrid attack type (MeleeRanged)", async () => {
    const itemMeleeRanged = await unitTestHelper.createItemMeleeRanged();

    await equipItem(itemMeleeRanged, character, "leftHand");
    const updatedCharacter = await Character.findById(character._id);

    if (!updatedCharacter) {
      throw new Error("Character not found");
    }

    expect(await updatedCharacter.attackType).toBe(EntityAttackType.MeleeRanged);
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});

const createItemBow = async (): Promise<IItem> => {
  const bowBluePrint = rangedWeaponsBlueprintIndex[RangedWeaponsBlueprint.Bow];
  const bow = new Item({
    ...bowBluePrint,
  });
  await bow.save();

  return bow;
};

const equipItem = async (item: IItem, character: ICharacter, handSlot: "leftHand" | "rightHand"): Promise<void> => {
  const equipment = (await Equipment.findById(character.equipment)) as IEquipment;

  if (!equipment) {
    throw new Error("Equipment not found");
  }

  equipment[handSlot] = item._id;
  await equipment.save();
};
