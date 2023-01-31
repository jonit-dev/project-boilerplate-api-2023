import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { InterpolationParser } from "../InterpolationParser";

describe("InterpolationParser.ts", () => {
  let interpolationParser: InterpolationParser;
  let testNPC: INPC;
  let testCharacter: ICharacter;

  beforeAll(async () => {
    interpolationParser = container.get<InterpolationParser>(InterpolationParser);
  });

  beforeEach(async () => {
    testNPC = await unitTestHelper.createMockNPC();
    testCharacter = await unitTestHelper.createMockCharacter();
  });

  it("should properly parse a dialog, with multiple variables", () => {
    const parsedText = interpolationParser.parseDialog(
      "Hello {{char.name}}, my name is {{npc.name}}. How are you doing today? I'm just a demonstration of my own movement type, {{npc.originalMovementType}}",
      testCharacter,
      testNPC
    );

    expect(parsedText).toBe(
      "Hello Test Character, my name is Test NPC. How are you doing today? I'm just a demonstration of my own movement type, Random"
    );
  });
});
