import { container, unitTestHelper } from "@providers/inversify/container";
import { MapLayers } from "@rpg-engine/shared";
import { GridManager } from "../GridManager";
import { MapTiles } from "../MapTiles";

describe("GridManager", () => {
  let gridManager: GridManager;
  let mapTiles: MapTiles;
  beforeAll(async () => {
    gridManager = container.get<GridManager>(GridManager);
    mapTiles = container.get<MapTiles>(MapTiles);

    await unitTestHelper.initializeMapLoader();

    await gridManager.generateGridSolids("unit-test-map-negative-coordinate");
    await gridManager.generateGridSolids("example");
  });

  beforeEach(async () => {});

  const getMapOffset = (mapName: string): { gridOffsetX: number; gridOffsetY: number } => {
    const initialXY = mapTiles.getFirstXY(mapName, MapLayers.Ground)!;
    return (gridManager as any).getMapOffset(initialXY[0], initialXY[1])!;
  };

  const checkMapSize = async (mapName: string, expectedWidth: number, expectedHeight: number): Promise<void> => {
    const hasGrid = await gridManager.hasGrid(mapName);

    expect(hasGrid).toBeTruthy();

    const grid = await gridManager.getGrid(mapName);

    if (!grid) {
      throw new Error("❌Could not find grid for map: " + mapName);
    }

    const { gridOffsetX, gridOffsetY } = getMapOffset(mapName)!;

    const { width, height } = mapTiles.getMapWidthHeight(mapName, gridOffsetX, gridOffsetY);

    expect(width).toBe(expectedWidth);
    expect(height).toBe(expectedHeight);
  };

  it("should properly generate a grid solid map and correctly size it (width, height)", async () => {
    await checkMapSize("unit-test-map-negative-coordinate", 48, 32);

    await checkMapSize("example", 80, 96);

    await checkMapSize("unit-test-map", 32, 32);
  });

  it("should return the offset x and y if a map has negative coordinates", () => {
    const { gridOffsetX, gridOffsetY } = getMapOffset("unit-test-map-negative-coordinate")!;

    expect(gridOffsetX).toBe(16);
    expect(gridOffsetY).toBe(0);

    const { gridOffsetX: gridOffsetX2, gridOffsetY: gridOffsetY2 } = getMapOffset("example")!;

    expect(gridOffsetX2).toBe(0);
    expect(gridOffsetY2).toBe(32);
  });

  it("shouldn't return a x and y offset if the map has no negative coordinates", () => {
    const { gridOffsetX, gridOffsetY } = getMapOffset("unit-test-map")!;

    expect(gridOffsetX).toBe(0);
    expect(gridOffsetY).toBe(0);
  });

  it("should properly set a grid solid and non-solids", async () => {
    const solids = [
      [-16, 0],
      [31, 31],
      [-10, 10],
      [-7, 16],
      [8, 23],
      [17, 23],
    ];

    for (const solid of solids) {
      const isSolidWalkable = await gridManager.isWalkable("unit-test-map-negative-coordinate", solid[0], solid[1]);
      expect(isSolidWalkable).toBe(false);
    }

    const nonSolids = [
      [17, 16],
      [18, 17],
      [-7, 13],
      [-12, 29],
      [27, 5],
    ];

    for (const nonSolid of nonSolids) {
      const isNonSolidWalkable = await gridManager.isWalkable(
        "unit-test-map-negative-coordinate",
        nonSolid[0],
        nonSolid[1]
      );
      expect(isNonSolidWalkable).toBe(true);
    }
  });

  it("should properly detect solids on a gridX and gridY for Example map", async () => {
    const nonSolids = [
      [4, 4],
      [23, 4],
      [4, 15],
      [23, 15],
      [14, 50],
    ];

    for (const nonSolid of nonSolids) {
      expect(await gridManager.isWalkable("example", nonSolid[0], nonSolid[1])).toBe(true);
    }

    const solids = [
      [0, -32],
      [0, 55],
      [63, 55],
      [63, -32],
      [36, 7],
      [36, 11],
      [8, 30],
      [20, 30],
      [13, 54],
    ];

    for (const solid of solids) {
      expect(await gridManager.isWalkable("example", solid[0], solid[1])).toBe(false);
    }
  });

  it("should properly set walkable", async () => {
    const x = -16;
    const y = 0;

    await gridManager.setWalkable("unit-test-map-negative-coordinate", x, y, false);
    expect(await gridManager.isWalkable("unit-test-map-negative-coordinate", x, y)).toBeFalsy();

    await gridManager.setWalkable("unit-test-map-negative-coordinate", x, y, true);
    expect(await gridManager.isWalkable("unit-test-map-negative-coordinate", x, y)).toBeTruthy();
  });

  it("should properly find the shortest path between 2 points with negative coordinates", async () => {
    const path = await gridManager.findShortestPath("unit-test-map-negative-coordinate", -11, 10, -8, 12);

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
    const path = await gridManager.findShortestPath("unit-test-map-negative-coordinate", 15, 24, 17, 25);

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
    const path = await gridManager.findShortestPath("unit-test-map-negative-coordinate", -11, 14, -9, 16);

    expect(path).toBeDefined();

    expect(path![0]).toMatchObject([-11, 14]);
    expect(path![path!.length - 1]).toMatchObject([-9, 16]);
  });

  it("calculates a shortest path between points (NEGATIVE COORDINATES), bottom right to top left", async () => {
    const path = await gridManager.findShortestPath("unit-test-map-negative-coordinate", -3, 17, -11, 9);

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
    const path = await gridManager.findShortestPath("unit-test-map-negative-coordinate", -9, 16, -11, 14);

    expect(path).toBeDefined();

    expect(path![0]).toMatchObject([-9, 16]);
    expect(path![path!.length - 1]).toMatchObject([-11, 14]);
  });

  it("calculates a shortest path between points (NEGATIVE COORDINATES), top right to bottom left", async () => {
    const path = await gridManager.findShortestPath("unit-test-map-negative-coordinate", -4, 9, -6, 11);

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

    const path = await gridManager.findShortestPath("unit-test-map-negative-coordinate", -6, 11, -4, 9);

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
    const path = await gridManager.findShortestPath("unit-test-map-negative-coordinate", 6, 22, 9, 25);

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
    const path = await gridManager.findShortestPath("unit-test-map-negative-coordinate", 9, 12, 6, 15);

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
    const path = await gridManager.findShortestPath("unit-test-map-negative-coordinate", 9, 15, 6, 12);

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
    const path = await gridManager.findShortestPath("unit-test-map-negative-coordinate", 6, 15, 9, 12);

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
    const path = await gridManager.findShortestPath("unit-test-map-negative-coordinate", -2, 18, 1, 18);

    expect(path).toBeDefined();

    expect(path).toMatchObject([
      [-2, 18],
      [-1, 18],
      [0, 18],
      [1, 18],
    ]);
  });

  it("calculates a shortest path between points (MIX COORDINATES), horizontal line, reverse", async () => {
    const path = await gridManager.findShortestPath("unit-test-map-negative-coordinate", 1, 18, -2, 18);

    expect(path).toBeDefined();

    expect(path).toMatchObject([
      [1, 18],
      [0, 18],
      [-1, 18],
      [-2, 18],
    ]);
  });

  it("calculates a shortest path between points (MIX COORDINATES), vertical line, forward", async () => {
    const path = await gridManager.findShortestPath("unit-test-map-negative-coordinate", -15, 0, -15, 3);

    expect(path).toBeDefined();

    expect(path).toMatchObject([
      [-15, 0],
      [-15, 1],
      [-15, 2],
      [-15, 3],
    ]);
  });

  it("calculates a shortest path between points (MIX COORDINATES), vertical line, reverse", async () => {
    const path = await gridManager.findShortestPath("unit-test-map-negative-coordinate", -15, 3, -15, 0);

    expect(path).toBeDefined();

    expect(path).toMatchObject([
      [-15, 3],
      [-15, 2],
      [-15, 1],
      [-15, 0],
    ]);
  });

  it("calculates a shortest path between points, straight line, obstacle in path", async () => {
    const path = await gridManager.findShortestPath("unit-test-map-negative-coordinate", -10, 12, -8, 12);

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
    const path = await gridManager.findShortestPath("unit-test-map-negative-coordinate", 30, 31, 31, 30);

    expect(path).toBeDefined();

    expect(path).toMatchObject([
      [30, 31],
      [30, 30],
      [31, 30],
    ]);
  });
});
