import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment, IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { bowsBlueprintIndex } from "@providers/item/data/blueprints/bows/index";
import { BowsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";

import { EquipmentRangeUpdate } from "../EquipmentRangeUpdate";

describe("EquipmentRangeUpdate.spec.ts", () => {
  let item: IItem;
  let character: ICharacter;
  let equipmentRangeUpdate: EquipmentRangeUpdate;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();
    equipmentRangeUpdate = container.get<EquipmentRangeUpdate>(EquipmentRangeUpdate);
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);

    item = (await unitTestHelper.createMockItem()) as unknown as IItem;
    character = await unitTestHelper.createMockCharacter(null, { hasEquipment: true });
  });

  it("should properly detect melee equipped items", async () => {
    await equipItem(item, character, "leftHand");

    await equipmentRangeUpdate.updateCharacterAttackType(character, item as any);

    const updatedCharacter = await Character.findById(character._id);

    if (!updatedCharacter) {
      throw new Error("Character not found");
    }

    expect(updatedCharacter.attackType).toBe(EntityAttackType.Melee);
  });

  it("should properly detect a ranged equipped item", async () => {
    const bow = await createItemBow();

    await equipItem(bow, character, "leftHand");

    await equipmentRangeUpdate.updateCharacterAttackType(character, item as any);

    const updatedCharacter = await Character.findById(character._id);

    if (!updatedCharacter) {
      throw new Error("Character not found");
    }

    expect(updatedCharacter.attackType).toBe(EntityAttackType.Ranged);
  });

  it("should properly detect a hybrid attack type (MeleeRanged)", async () => {
    const bow = await createItemBow();

    await equipItem(bow, character, "leftHand");
    await equipItem(item, character, "rightHand");

    await equipmentRangeUpdate.updateCharacterAttackType(character, item as any);

    const updatedCharacter = await Character.findById(character._id);

    if (!updatedCharacter) {
      throw new Error("Character not found");
    }

    expect(updatedCharacter.attackType).toBe(EntityAttackType.MeleeRanged);
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});

const createItemBow = async (): Promise<IItem> => {
  const bowBluePrint = bowsBlueprintIndex[BowsBlueprint.Bow];
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
