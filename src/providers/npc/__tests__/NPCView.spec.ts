/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { FromGridX, FromGridY } from "@rpg-engine/shared";
import { NPCView } from "../NPCView";

describe("NPCView.ts", () => {
  let npcView: NPCView;
  let testNPC: INPC;
  let testCharacter: ICharacter;
  let farAwayCharacter: ICharacter;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();

    npcView = container.get<NPCView>(NPCView);
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);

    testNPC = await unitTestHelper.createMockNPC(
      {
        x: FromGridX(0),
        y: FromGridY(0),
        health: 100,
        scene: "example",
      },
      { hasSkills: true }
    );
  });

  it("should include characters that are inside the NPC socket transmission zone", async () => {
    const testCharInsideView = await unitTestHelper.createMockCharacter();

    const charactersInView = await npcView.getCharactersInView(testNPC);

    const hasTestCharacter = charactersInView.some((character) => {
      return character.name === testCharInsideView.name;
    });

    expect(hasTestCharacter).toBeTruthy();
  });

  it("should not fetch any character if its X and Y position is outside socket transmission zone", async () => {
    const charOutsideView = await unitTestHelper.createMockCharacter({
      x: 240,
      y: 1000,
    });

    const charactersInView = await npcView.getCharactersInView(testNPC);

    const hasCharacter = charactersInView.some((character) => {
      return character.name === charOutsideView.name;
    });

    expect(hasCharacter).toBeFalsy();
    expect(charactersInView).toHaveLength(0); // only test character is inside view, not this one we just created now
  });

  it("should properly get the nearest character", async () => {
    testCharacter = await unitTestHelper.createMockCharacter({
      name: "testCharacter",
      x: FromGridX(1),
      y: FromGridY(0),
    });
    farAwayCharacter = await unitTestHelper.createMockCharacter({
      name: "farAwayCharacter",
      x: FromGridX(10),
      y: FromGridY(10),
    });

    const nearestCharacter = await npcView.getNearestCharacter(testNPC);

    expect(nearestCharacter).toBeDefined();

    expect(nearestCharacter?.name).toBe(testCharacter.name);

    expect(nearestCharacter?.name).not.toBe(farAwayCharacter.name);
  });

  it("should properly warn characters about NPCs in view", async () => {
    testCharacter = await unitTestHelper.createMockCharacter({
      name: "testCharacter",
      x: FromGridX(1),
      y: FromGridY(0),
      health: 100,
      scene: "example",
    });

    // @ts-ignore
    const spyOnSocketMessaging = jest.spyOn(npcView.socketMessaging, "sendEventToUser");

    await npcView.warnCharacterAboutNPCsInView(testCharacter);

    expect(spyOnSocketMessaging).toHaveBeenCalled();
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
