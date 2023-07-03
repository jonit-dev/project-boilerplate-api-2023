import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { IEquippableAccessoryTier1Blueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { AccessoriesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
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

    testItem = await unitTestHelper.createMockItemFromBlueprint(AccessoriesBlueprint.HasteRing);
  });

  it("should support multiple added buffs on an item", async () => {
    await characterItemBuff.enableItemBuff(testCharacter, testItem);

    const characterBuffs = await characterBuffTracker.getAllCharacterBuffs(testCharacter._id);

    expect(characterBuffs).toHaveLength(1);
  });
});
