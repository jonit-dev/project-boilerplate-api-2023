import { INPC } from "@entities/ModuleNPC/NPCModel";
import { CharacterView } from "@providers/character/CharacterView";
import { unitTestHelper } from "@providers/inversify/container";
import { MathHelper } from "@providers/math/MathHelper";
import { GRID_WIDTH } from "@rpg-engine/shared";
import { NPCSpawn } from "../NPCSpawn";
import { NPCView } from "../NPCView";
import { NPCWarn } from "../NPCWarn";
import { NPCTarget } from "../movement/NPCTarget";

describe("NPCSpawn", () => {
  let npc: INPC;
  let npcView: NPCView;
  let mathHelper: MathHelper;
  let npcWarn: NPCWarn;
  let characterView: CharacterView;
  let npcTarget: NPCTarget;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();
  });
  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);
    npc = await unitTestHelper.createMockNPC(null, {});

    npcView = {
      save: jest.fn(() => Promise.resolve()),
    } as unknown as NPCView;

    mathHelper = {
      getDistanceBetweenPoints: jest.fn(() => 0),
    } as unknown as MathHelper;

    characterView = {
      getCharactersAroundXYPosition: jest.fn(() => []),
      getNearestCharactersFromXYPoint: jest.fn(() => undefined),
    } as unknown as CharacterView;

    npcTarget = {
      clearTarget: jest.fn(() => Promise.resolve()),
    } as unknown as NPCTarget;

    npcWarn = {
      warnCharacterAboutNPCsInView: jest.fn(() => Promise.resolve()),
    } as unknown as NPCWarn;
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });

  it("should reset the NPC's health and mana to their maximum values", async () => {
    npc.maxHealth = 20;
    npc.maxMana = 10;
    npc.health = 10;

    const spawner = new NPCSpawn(npcView, characterView, mathHelper, npcTarget, npcWarn);
    await spawner.spawn(npc);

    expect(npc.health).toEqual(20);
    expect(npc.mana).toEqual(10);
  });

  it("should clear the NPC's target", async () => {
    const spawner = new NPCSpawn(npcView, characterView, mathHelper, npcTarget, npcWarn);
    await spawner.spawn(npc);
    expect(npcTarget.clearTarget).toHaveBeenCalledWith(npc);
  });

  it("should returns false when the nearest character is within 20 grid units of the NPC's initial position", async () => {
    const nearestCharacter = { x: npc.initialX, y: npc.initialY + GRID_WIDTH * 19 };
    // @ts-ignore
    characterView.getNearestCharactersFromXYPoint.mockReturnValueOnce(nearestCharacter);
    // @ts-ignore
    mathHelper.getDistanceBetweenPoints.mockReturnValueOnce(GRID_WIDTH * 19);

    const npcSpawn = new NPCSpawn(npcView, characterView, mathHelper, npcTarget, npcWarn);
    // @ts-ignore
    const result = await npcSpawn.canSpawn(npc);
    expect(result).toBe(false);
  });

  it("should returns true when the nearest character is more than 20 grid units away from the NPC's initial position", async () => {
    const nearestCharacter = { x: npc.initialX, y: npc.initialY + GRID_WIDTH * 21 };
    // @ts-ignore
    characterView.getNearestCharactersFromXYPoint.mockReturnValueOnce(nearestCharacter);
    // @ts-ignore
    mathHelper.getDistanceBetweenPoints.mockReturnValueOnce(GRID_WIDTH * 21);

    const npcSpawn = new NPCSpawn(npcView, characterView, mathHelper, npcTarget, npcWarn);
    // @ts-ignore
    const result = await npcSpawn.canSpawn(npc);
    expect(result).toBe(true);
  });

  it("should true when there are no characters within the NPC's initial position", async () => {
    // @ts-ignore
    characterView.getNearestCharactersFromXYPoint.mockReturnValueOnce(null);

    const npcSpawn = new NPCSpawn(npcView, characterView, mathHelper, npcTarget, npcWarn);
    // @ts-ignore
    const result = await npcSpawn.canSpawn(npc);
    expect(result).toBe(true);
  });
});
