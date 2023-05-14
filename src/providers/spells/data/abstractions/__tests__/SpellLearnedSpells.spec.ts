import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { SpellSocketEvents, UISocketEvents } from "@rpg-engine/shared";
import { SpellsBlueprint } from "../../types/SpellsBlueprintTypes";
import { SpellLearnedSpells } from "../SpellLearnedSpells";

describe("SpellLearnedSpells", () => {
  let testCharacter: ICharacter;
  let learnedSpells: SpellLearnedSpells;
  let sendEventToUser: jest.SpyInstance;

  beforeAll(() => {
    learnedSpells = container.get(SpellLearnedSpells);
  });

  beforeEach(async () => {
    testCharacter = await unitTestHelper.createMockCharacter();
    testCharacter.learnedSpells = [SpellsBlueprint.SelfHealingSpell, SpellsBlueprint.ArrowCreationSpell];
    await testCharacter.save();

    // @ts-ignore
    sendEventToUser = jest.spyOn(learnedSpells.socketMessaging, "sendEventToUser");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns character learnedSpells info", () => {
    learnedSpells.sendCharacterLearnedSpellsInfoEvent(testCharacter);

    expect(sendEventToUser).toBeCalledTimes(1);
    expect(sendEventToUser).toBeCalledWith(
      testCharacter.channelId!,
      SpellSocketEvents.LearnedSpells,
      expect.arrayContaining([
        expect.objectContaining({
          key: SpellsBlueprint.SelfHealingSpell,
        }),
        expect.objectContaining({
          key: SpellsBlueprint.ArrowCreationSpell,
        }),
      ])
    );
  });

  it("handles empty learnedSpells array", () => {
    testCharacter.learnedSpells = [];
    learnedSpells.sendCharacterLearnedSpellsInfoEvent(testCharacter);

    expect(sendEventToUser).toBeCalledTimes(1);
    expect(sendEventToUser).toBeCalledWith(testCharacter.channelId!, UISocketEvents.ShowMessage, {
      message: "No spells available",
      type: "error",
    });
  });

  it("handles undefined learnedSpells", () => {
    testCharacter.learnedSpells = undefined;
    learnedSpells.sendCharacterLearnedSpellsInfoEvent(testCharacter);

    expect(sendEventToUser).toBeCalledTimes(1);
    expect(sendEventToUser).toBeCalledWith(testCharacter.channelId!, UISocketEvents.ShowMessage, {
      message: "No spells available",
      type: "error",
    });
  });

  it("handles non-existing spells in learnedSpells", () => {
    testCharacter.learnedSpells = ["nonExistingSpell"];
    learnedSpells.sendCharacterLearnedSpellsInfoEvent(testCharacter);

    expect(sendEventToUser).toBeCalledTimes(1);
    expect(sendEventToUser).toBeCalledWith(testCharacter.channelId!, UISocketEvents.ShowMessage, {
      message: "No spells available",
      type: "error",
    });
  });
});
