import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { SpellSocketEvents, SpellsBlueprint, UISocketEvents } from "@rpg-engine/shared";

import { SpellLearnedSpells } from "../SpellLearnedSpells";

describe("SpellLearnedSpells", () => {
  let testCharacter: ICharacter;
  let learnedSpells: SpellLearnedSpells;
  let sendEventToUser: jest.SpyInstance;

  beforeAll(() => {
    learnedSpells = container.get(SpellLearnedSpells);
  });

  beforeEach(async () => {
    testCharacter = await unitTestHelper.createMockCharacter(null, { hasSkills: true });
    testCharacter.learnedSpells = [SpellsBlueprint.SelfHealingSpell, SpellsBlueprint.ArrowCreationSpell];
    await testCharacter.save();

    // @ts-ignore
    sendEventToUser = jest.spyOn(learnedSpells.socketMessaging, "sendEventToUser");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns character learnedSpells info", async () => {
    await learnedSpells.sendCharacterLearnedSpellsInfoEvent(testCharacter);

    expect(sendEventToUser).toBeCalledTimes(1);
    expect(sendEventToUser).toBeCalledWith(testCharacter.channelId!, SpellSocketEvents.LearnedSpells, {
      learnedSpells: expect.arrayContaining([
        expect.objectContaining({
          key: SpellsBlueprint.SelfHealingSpell,
        }),
        expect.objectContaining({
          key: SpellsBlueprint.ArrowCreationSpell,
        }),
      ]),
      magicLevel: expect.any(Number),
    });
  });

  it("handles empty learnedSpells array", async () => {
    testCharacter.learnedSpells = [];
    await learnedSpells.sendCharacterLearnedSpellsInfoEvent(testCharacter);

    expect(sendEventToUser).toBeCalledTimes(1);
    expect(sendEventToUser).toBeCalledWith(testCharacter.channelId!, UISocketEvents.ShowMessage, {
      message: "No spells available",
      type: "error",
    });
  });

  it("handles undefined learnedSpells", async () => {
    testCharacter.learnedSpells = undefined;
    await learnedSpells.sendCharacterLearnedSpellsInfoEvent(testCharacter);

    expect(sendEventToUser).toBeCalledTimes(1);
    expect(sendEventToUser).toBeCalledWith(testCharacter.channelId!, UISocketEvents.ShowMessage, {
      message: "No spells available",
      type: "error",
    });
  });

  it("handles non-existing spells in learnedSpells", async () => {
    testCharacter.learnedSpells = ["nonExistingSpell"];
    await learnedSpells.sendCharacterLearnedSpellsInfoEvent(testCharacter);

    expect(sendEventToUser).toBeCalledTimes(1);
    expect(sendEventToUser).toBeCalledWith(testCharacter.channelId!, UISocketEvents.ShowMessage, {
      message: "No spells available",
      type: "error",
    });
  });
});
