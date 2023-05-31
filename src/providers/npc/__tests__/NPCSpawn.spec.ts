import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { CharacterView } from "@providers/character/CharacterView";
import { container, unitTestHelper } from "@providers/inversify/container";
import { MathHelper } from "@providers/math/MathHelper";
import { GRID_WIDTH } from "@rpg-engine/shared";
import dayjs from "dayjs";
import { NPCSpawn } from "../NPCSpawn";
import { NPCView } from "../NPCView";

describe("NPCSpawn", () => {
  let npc: INPC;
  let npcView: NPCView;
  let mathHelper: MathHelper;
  let characterView: CharacterView;
  let npcSpawn: NPCSpawn;

  beforeEach(async () => {
    npc = await unitTestHelper.createMockNPC(null, {});

    npcSpawn = container.get<NPCSpawn>(NPCSpawn);
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
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should not spawn the NPC if it is too close to the nearest character", async () => {
    // @ts-ignore
    const canSpawnSpy = jest.spyOn(npcSpawn, "canSpawn").mockImplementation(() => false);
    await npcSpawn.spawn(npc);
    expect(canSpawnSpy).toHaveBeenCalledWith(npc);
    // @ts-ignore
    expect(npcView.save).not.toHaveBeenCalled();
  });

  it("should reset the NPC's health and mana to their maximum values", async () => {
    npc.maxHealth = 20;
    npc.maxMana = 10;
    npc.health = 10;

    await npcSpawn.spawn(npc);

    npc = await NPC.findById(npc._id).lean();

    expect(npc.health).toEqual(20);
    expect(npc.mana).toEqual(10);
  });

  it("should set the NPC's health and mana to their maximum values and clear its applied entity effects before spawning it", async () => {
    // @ts-ignore
    jest.spyOn(npcSpawn, "canSpawn").mockImplementation(() => true);
    await npcSpawn.spawn(npc);

    npc = await NPC.findById(npc._id).lean();

    expect(npc.health).toEqual(npc.maxHealth);
    expect(npc.mana).toEqual(npc.maxMana);
    expect(npc.appliedEntityEffects).toHaveLength(0);
  });

  it("should returns true when the nearest character is more than 20 grid units away from the NPC's initial position", async () => {
    const nearestCharacter = { x: npc.initialX, y: npc.initialY + GRID_WIDTH * 21 };
    // @ts-ignore
    characterView.getNearestCharactersFromXYPoint.mockReturnValueOnce(nearestCharacter);
    // @ts-ignore
    mathHelper.getDistanceBetweenPoints.mockReturnValueOnce(GRID_WIDTH * 21);

    // @ts-ignore
    const result = await npcSpawn.canSpawn(npc);
    expect(result).toBe(true);
  });

  it("should true when there are no characters within the NPC's initial position", async () => {
    // @ts-ignore
    characterView.getNearestCharactersFromXYPoint.mockReturnValueOnce(null);

    // @ts-ignore
    const result = await npcSpawn.canSpawn(npc);
    expect(result).toBe(true);
  });

  it("should clear the NPC's target", async () => {
    const clearTargetMock = jest.fn().mockResolvedValue(null);
    // @ts-ignore
    npcSpawn.npcTarget.clearTarget = clearTargetMock;
    await npcSpawn.spawn(npc);
    expect(clearTargetMock).toHaveBeenCalledWith(npc);
  });

  it("should return false when the nearest character is within 20 grid units of the NPC's initial position", async () => {
    // @ts-ignore
    const getNearestCharactersFromXYPointMock = jest.fn().mockResolvedValue(npc as any);
    // @ts-ignore
    npcSpawn.characterView.getNearestCharactersFromXYPoint = getNearestCharactersFromXYPointMock;

    // @ts-ignore
    const result = await npcSpawn.canSpawn(npc);
    expect(result).toBe(false);
  });

  it("should transform the NPC into giant form", async () => {
    const transformMock = jest.fn().mockResolvedValue(null);
    // @ts-ignore
    npcSpawn.npcGiantForm.randomlyTransformNPCIntoGiantForm = transformMock;
    await npcSpawn.spawn(npc);
    expect(transformMock).toHaveBeenCalledWith(npc);
  });

  it("should reset the NPC's form", async () => {
    const resetMock = jest.fn().mockResolvedValue(null);
    // @ts-ignore
    npcSpawn.npcGiantForm.resetNPCToNormalForm = resetMock;
    await npcSpawn.spawn(npc);
    expect(resetMock).toHaveBeenCalledWith(npc);
  });

  describe("calculateSpawnTime", () => {
    it("should correctly calculate spawn time based on the strength level", () => {
      // testing lower boundary
      let spawnTime = npcSpawn.calculateSpawnTime(1);
      let expectedTime = dayjs().add(1, "minutes").toDate();
      expect(spawnTime.getMinutes()).toEqual(expectedTime.getMinutes());

      // testing middle value
      spawnTime = npcSpawn.calculateSpawnTime(72); // strengthLevel of 72 should result in spawnTime of 12 minutes
      expectedTime = dayjs().add(12, "minutes").toDate();
      expect(spawnTime.getMinutes()).toEqual(expectedTime.getMinutes());

      // testing upper boundary
      spawnTime = npcSpawn.calculateSpawnTime(200); // should be capped at 20 minutes
      expectedTime = dayjs().add(20, "minutes").toDate();
      expect(spawnTime.getMinutes()).toEqual(expectedTime.getMinutes());
    });
  });
});
