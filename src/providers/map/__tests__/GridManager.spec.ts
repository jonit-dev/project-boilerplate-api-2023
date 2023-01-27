import { RedisManager } from "@providers/database/RedisManager";
import { container, unitTestHelper } from "@providers/inversify/container";
import { GridManager } from "../GridManager";
import { MapTiles } from "../MapTiles";
import { GridRedisSerializer } from "../grid/GridRedisSerializer";

describe("GridManager", () => {
  let gridManager: GridManager;
  let mapTiles: MapTiles;
  let redisManager: RedisManager;
  let gridRedisSerializer: GridRedisSerializer;
  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();
    redisManager = container.get<RedisManager>(RedisManager);
    await redisManager.connect();

    gridManager = container.get<GridManager>(GridManager);
    gridRedisSerializer = container.get<GridRedisSerializer>(GridRedisSerializer);
    mapTiles = container.get<MapTiles>(MapTiles);

    await unitTestHelper.initializeMapLoader();

    await gridManager.generateGridSolids("unit-test-map-negative-coordinate");
    await gridManager.generateGridSolids("example");
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);
  });

  const checkMapSize = async (mapName: string, expectedWidth: number, expectedHeight: number): Promise<void> => {
    const hasGrid = await gridManager.hasGrid(mapName);

    expect(hasGrid).toBeTruthy();

    const grid = await gridManager.getGrid(mapName);

    if (!grid) {
      throw new Error("❌Could not find grid for map: " + mapName);
    }

    const { gridOffsetX, gridOffsetY } = gridManager.getMapOffset(mapName)!;

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
    const { gridOffsetX, gridOffsetY } = gridManager.getMapOffset("unit-test-map-negative-coordinate")!;

    expect(gridOffsetX).toBe(16);
    expect(gridOffsetY).toBe(0);

    const { gridOffsetX: gridOffsetX2, gridOffsetY: gridOffsetY2 } = gridManager.getMapOffset("example")!;

    expect(gridOffsetX2).toBe(0);
    expect(gridOffsetY2).toBe(32);
  });

  it("shouldn't return a x and y offset if the map has no negative coordinates", () => {
    const { gridOffsetX, gridOffsetY } = gridManager.getMapOffset("unit-test-map")!;

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

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
