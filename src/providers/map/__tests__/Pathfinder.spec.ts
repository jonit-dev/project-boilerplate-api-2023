import { container, unitTestHelper } from "@providers/inversify/container";

import { INPC } from "@entities/ModuleNPC/NPCModel";
import { GridManager } from "../GridManager";
import { Pathfinder } from "../Pathfinder";

describe("Pathfinder", () => {
  let pathfinder: Pathfinder;
  let gridManager: GridManager;
  let testNPC: INPC;

  beforeAll(async () => {
    pathfinder = container.get(Pathfinder);
    gridManager = container.get<GridManager>(GridManager);

    await unitTestHelper.initializeMapLoader();

    await gridManager.generateGridSolids("unit-test-map-negative-coordinate");
    await gridManager.generateGridSolids("example");
  });

  beforeEach(async () => {
    testNPC = await unitTestHelper.createMockNPC();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should properly find the shortest path between 2 points with negative coordinates", async () => {
    const path = await pathfinder.findShortestPath(testNPC, "unit-test-map-negative-coordinate", -11, 10, -8, 12);

    if (!path) {
      throw new Error("❌Could not find path");
    }

    expect(path).toEqual([
      [-11, 10],
      [-11, 11],
      [-10, 11],
      [-9, 11],
      [-8, 11],
      [-8, 12],
    ]);
  });

  it("should properly find the shortest path between 2 points WITHOUT negative coordinates", async () => {
    const path = await pathfinder.findShortestPath(testNPC, "unit-test-map-negative-coordinate", 15, 24, 17, 25);

    if (!path) {
      throw new Error("❌Could not find path");
    }

    expect(path).toEqual([
      [15, 24],
      [15, 25],
      [16, 25],
      [17, 25],
    ]);
  });

  it("calculates a shortest path between points (NEGATIVE COORDINATES), top left to bottom right", async () => {
    const path = await pathfinder.findShortestPath(testNPC, "unit-test-map-negative-coordinate", -11, 14, -9, 16);

    expect(path).toBeDefined();

    expect(path![0]).toMatchObject([-11, 14]);
    expect(path![path!.length - 1]).toMatchObject([-9, 16]);
  });

  it("calculates a shortest path between points (NEGATIVE COORDINATES), bottom right to top left", async () => {
    const path = await pathfinder.findShortestPath(testNPC, "unit-test-map-negative-coordinate", -3, 17, -11, 9);

    expect(path).toBeDefined();

    expect(path![0]).toMatchObject([-3, 17]);
    expect(path![path!.length - 1]).toMatchObject([-11, 9]);

    expect(path).toMatchObject([
      [-3, 17],
      [-3, 16],
      [-3, 15],
      [-3, 14],
      [-3, 13],
      [-3, 12],
      [-3, 11],
      [-3, 10],
      [-3, 9],
      [-4, 9],
      [-5, 9],
      [-6, 9],
      [-7, 9],
      [-8, 9],
      [-9, 9],
      [-10, 9],
      [-11, 9],
    ]);
  });

  it("calculates a shortest path between points (NEGATIVE COORDINATES), bottom right to top left, another test", async () => {
    const path = await pathfinder.findShortestPath(testNPC, "unit-test-map-negative-coordinate", -9, 16, -11, 14);

    expect(path).toBeDefined();

    expect(path![0]).toMatchObject([-9, 16]);
    expect(path![path!.length - 1]).toMatchObject([-11, 14]);
  });

  it("calculates a shortest path between points (NEGATIVE COORDINATES), top right to bottom left", async () => {
    const path = await pathfinder.findShortestPath(testNPC, "unit-test-map-negative-coordinate", -4, 9, -6, 11);

    expect(path).toBeDefined();

    expect(path).toMatchObject([
      [-4, 9],
      [-4, 10],
      [-4, 11],
      [-5, 11],
      [-6, 11],
    ]);
  });

  it("calculates a shortest path between points (NEGATIVE COORDINATES), bottom left to top right", async () => {
    console.time("pathfindingQuadTree.findShortestPathBetweenPoints");

    const path = await pathfinder.findShortestPath(testNPC, "unit-test-map-negative-coordinate", -6, 11, -4, 9);

    expect(path).toBeDefined();

    expect(path).toMatchObject([
      [-6, 11],
      [-6, 10],
      [-6, 9],
      [-5, 9],
      [-4, 9],
    ]);
  });

  it("calculates a shortest path between points (POSITIVE COORDINATES), top left to bottom right", async () => {
    const path = await pathfinder.findShortestPath(testNPC, "unit-test-map-negative-coordinate", 6, 22, 9, 25);

    expect(path).toBeDefined();

    expect(path).toMatchObject([
      [6, 22],
      [6, 23],
      [6, 24],
      [6, 25],
      [7, 25],
      [8, 25],
      [9, 25],
    ]);
  });

  it("calculates a shortest path between points (POSITIVE COORDINATES), top right to bottom left", async () => {
    const path = await pathfinder.findShortestPath(testNPC, "unit-test-map-negative-coordinate", 9, 12, 6, 15);

    expect(path).toBeDefined();

    expect(path).toMatchObject([
      [9, 12],
      [9, 13],
      [9, 14],
      [9, 15],
      [8, 15],
      [7, 15],
      [6, 15],
    ]);
  });

  it("calculates a shortest path between points (POSITIVE COORDINATES), bottom right to top left", async () => {
    const path = await pathfinder.findShortestPath(testNPC, "unit-test-map-negative-coordinate", 9, 15, 6, 12);

    expect(path).toBeDefined();

    expect(path).toMatchObject([
      [9, 15],
      [9, 14],
      [9, 13],
      [9, 12],
      [8, 12],
      [7, 12],
      [6, 12],
    ]);
  });

  it("calculates a shortest path between points (POSITIVE COORDINATES), bottom left to top right", async () => {
    const path = await pathfinder.findShortestPath(testNPC, "unit-test-map-negative-coordinate", 6, 15, 9, 12);

    expect(path).toBeDefined();

    expect(path).toMatchObject([
      [6, 15],
      [6, 14],
      [6, 13],
      [6, 12],
      [7, 12],
      [8, 12],
      [9, 12],
    ]);
  });

  it("calculates a shortest path between points (MIX COORDINATES), horizontal line, forward", async () => {
    const path = await pathfinder.findShortestPath(testNPC, "unit-test-map-negative-coordinate", -2, 18, 1, 18);

    expect(path).toBeDefined();

    expect(path).toMatchObject([
      [-2, 18],
      [-1, 18],
      [0, 18],
      [1, 18],
    ]);
  });

  it("calculates a shortest path between points (MIX COORDINATES), horizontal line, reverse", async () => {
    const path = await pathfinder.findShortestPath(testNPC, "unit-test-map-negative-coordinate", 1, 18, -2, 18);

    expect(path).toBeDefined();

    expect(path).toMatchObject([
      [1, 18],
      [0, 18],
      [-1, 18],
      [-2, 18],
    ]);
  });

  it("calculates a shortest path between points (MIX COORDINATES), vertical line, forward", async () => {
    const path = await pathfinder.findShortestPath(testNPC, "unit-test-map-negative-coordinate", -15, 0, -15, 3);

    expect(path).toBeDefined();

    expect(path).toMatchObject([
      [-15, 0],
      [-15, 1],
      [-15, 2],
      [-15, 3],
    ]);
  });

  it("calculates a shortest path between points (MIX COORDINATES), vertical line, reverse", async () => {
    const path = await pathfinder.findShortestPath(testNPC, "unit-test-map-negative-coordinate", -15, 3, -15, 0);

    expect(path).toBeDefined();

    expect(path).toMatchObject([
      [-15, 3],
      [-15, 2],
      [-15, 1],
      [-15, 0],
    ]);
  });

  it("calculates a shortest path between points, straight line, obstacle in path", async () => {
    const path = await pathfinder.findShortestPath(testNPC, "unit-test-map-negative-coordinate", -10, 12, -8, 12);

    expect(path).toBeDefined();

    expect(path).toMatchObject([
      [-10, 12],
      [-10, 11],
      [-9, 11],
      [-8, 11],
      [-8, 12],
    ]);
  });

  it("calculates a shortest path between points, at the bottom corner of map", async () => {
    const path = await pathfinder.findShortestPath(testNPC, "unit-test-map-negative-coordinate", 30, 31, 31, 30);

    expect(path).toBeDefined();

    expect(path).toMatchObject([
      [30, 31],
      [30, 30],
      [31, 30],
    ]);
  });
});
