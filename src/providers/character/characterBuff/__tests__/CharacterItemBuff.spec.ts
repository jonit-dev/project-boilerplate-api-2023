import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { itemsBlueprintIndex } from "@providers/item/data";
import { IEquippableAccessoryTier1Blueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { BasicAttribute, CharacterAttributes, CharacterBuffDurationType, CharacterBuffType } from "@rpg-engine/shared";
import { CharacterBuffTracker } from "../CharacterBuffTracker";
import { CharacterItemBuff } from "../CharacterItemBuff";

describe("CharacterItemBuff", () => {
  let characterItemBuff: CharacterItemBuff;

  let testItem: IItem;
  let testCharacter: ICharacter;
  let testItemBlueprint: IEquippableAccessoryTier1Blueprint;

  let characterBuffTracker: CharacterBuffTracker;

  beforeAll(() => {
    characterItemBuff = container.get(CharacterItemBuff);
    characterBuffTracker = container.get(CharacterBuffTracker);
  });

  beforeEach(async () => {
    testCharacter = await unitTestHelper.createMockCharacter(null, { hasSkills: true });
    testItem = await unitTestHelper.createMockItem();

    testItemBlueprint = itemsBlueprintIndex[testItem.baseKey] as IEquippableAccessoryTier1Blueprint;

    testItemBlueprint.equippedBuff = [
      {
        type: CharacterBuffType.CharacterAttribute,
        trait: CharacterAttributes.Speed,
        buffPercentage: 20,
        durationType: CharacterBuffDurationType.Permanent,
      },
      {
        type: CharacterBuffType.Skill,
        trait: BasicAttribute.Resistance,
        buffPercentage: 10,
        durationType: CharacterBuffDurationType.Permanent,
      },
    ];
  });

  it("should support multiple added buffs on an item", async () => {
    await characterItemBuff.enableItemBuff(testCharacter, testItem);

    const characterBuffs = await characterBuffTracker.getAllCharacterBuffs(testCharacter._id);

    expect(characterBuffs).toHaveLength(2);
  });
});
