import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Item } from "@entities/ModuleInventory/ItemModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { TimerWrapper } from "@providers/helpers/TimerWrapper";
import { container, unitTestHelper } from "@providers/inversify/container";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { spellGreaterHealing } from "@providers/spells/data/blueprints/all/SpellGreaterHealing";
import { spellSelfHealing } from "@providers/spells/data/blueprints/all/SpellSelfHealing";
import { berserkerSpellExecution } from "@providers/spells/data/blueprints/berserker/SpellExecution";
import { CharacterClass } from "@rpg-engine/shared";
import { Execution } from "../Execution";

describe("Execution", () => {
  let testCharacter: ICharacter;
  let targetCharacter: ICharacter;
  let executionSpell: Execution;
  let sendEventToUser: jest.SpyInstance;
  let targetNPC: INPC;

  beforeAll(() => {
    executionSpell = container.get(Execution);

    jest.spyOn(TimerWrapper.prototype, "setTimeout").mockImplementation();

    jest.spyOn(SocketMessaging.prototype, "sendEventToUser").mockImplementation();
  });

  beforeEach(async () => {
    testCharacter = await unitTestHelper.createMockCharacter(
      {
        health: 50,
        learnedSpells: [spellSelfHealing.key, spellGreaterHealing.key, berserkerSpellExecution.key],
        class: CharacterClass.Berserker,
      },
      { hasSkills: true }
    );

    await Character.findByIdAndUpdate(testCharacter.id, { class: CharacterClass.Rogue });

    targetCharacter = await unitTestHelper.createMockCharacter(
      { health: 100 },
      { hasEquipment: false, hasInventory: false, hasSkills: true }
    );

    targetNPC = await unitTestHelper.createMockNPC({ health: 5 }, { hasSkills: true });

    sendEventToUser = jest.spyOn(SocketMessaging.prototype, "sendEventToUser");
  });

  it("should not execute spell if the health target > 30%", async () => {
    const timerMock = jest.spyOn(TimerWrapper.prototype, "setTimeout");
    timerMock.mockImplementation();

    targetCharacter.health = 100;
    await Character.findByIdAndUpdate(targetCharacter._id, targetCharacter);

    await executionSpell.handleBerserkerExecution(testCharacter, targetCharacter);

    const characterBody = await Item.findOne({
      name: `${targetCharacter.name}'s body`,
      scene: targetCharacter.scene,
    })
      .populate("itemContainer")
      .exec();

    expect(characterBody).toBeNull();
    expect(targetCharacter.health).toBe(100);
    expect(targetCharacter.isAlive).toBe(true);
  });

  it("should execute spell successfully for an NPC target", async () => {
    const timerMock = jest.spyOn(TimerWrapper.prototype, "setTimeout");
    timerMock.mockImplementation();

    expect(targetNPC.health).toBe(5);
    expect(targetNPC.isAlive).toBe(true);

    await executionSpell.handleBerserkerExecution(testCharacter, targetNPC);

    const updateNPC = (await NPC.findById(targetNPC._id).lean()) as INPC;

    const npcBody = await Item.findOne({
      name: `${targetNPC.name}'s body`,
      scene: targetNPC.scene,
    })
      .populate("itemContainer")
      .exec();

    expect(npcBody).not.toBeNull();

    expect(updateNPC.health).toBe(0);
  });
});
