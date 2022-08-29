import { container, unitTestHelper } from "@providers/inversify/container";
import { MapLayers } from "@rpg-engine/shared";
import { GridManager } from "../GridManager";
import { MapTiles } from "../MapTiles";

describe("GridManager", () => {
  let gridManager: GridManager;
  let mapTiles: MapTiles;
  const mapName = "unit-test-map-negative-coordinate";
  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();

    gridManager = container.get<GridManager>(GridManager);
    mapTiles = container.get<MapTiles>(MapTiles);
    await unitTestHelper.initializeMapLoader();

    gridManager.generateGridSolids("unit-test-map-negative-coordinate");
    gridManager.generateGridSolids("example");
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);
  });

  const checkMapSize = (mapName: string): void => {
    expect(gridManager.grids.has(mapName)).toBeTruthy();

    const grid = gridManager.grids.get(mapName);

    if (!grid) {
      throw new Error("❌Could not find grid for map: " + mapName);
    }

    const { gridOffsetX, gridOffsetY } = gridManager.getGridOffset(mapName)!;

    const { width, height } = mapTiles.getMapWidthHeight(mapName, MapLayers.Ground, gridOffsetX, gridOffsetY);
    console.log(`Map ${mapName} has grid offset: ${gridOffsetX}, ${gridOffsetY} and size ${width}, ${height}`);

    expect(grid.width).toBe(width);
    expect(grid.height).toBe(height);
  };

  it("should properly generate a grid solid map and correctly size it (width, height)", () => {
    checkMapSize(mapName);
    checkMapSize("example");
  });

  it("should return the offset x and y if a map has negative coordinates", () => {
    const { gridOffsetX, gridOffsetY } = gridManager.getGridOffset(mapName)!;

    expect(gridOffsetX).toBe(16);
    expect(gridOffsetY).toBe(0);

    const { gridOffsetX: gridOffsetX2, gridOffsetY: gridOffsetY2 } = gridManager.getGridOffset("example")!;

    expect(gridOffsetX2).toBe(0);
    expect(gridOffsetY2).toBe(32);
  });

  it("shouldn't return a x and y offset if the map has no negative coordinates", () => {
    const { gridOffsetX, gridOffsetY } = gridManager.getGridOffset("unit-test-map")!;

    expect(gridOffsetX).toBe(0);
    expect(gridOffsetY).toBe(0);
  });

  it("should properly set a grid solid and non-solids", () => {
    const solids = [
      [-16, 0],
      [31, 31],
      [-10, 10],
      [-7, 16],
      [8, 23],
      [17, 23],
    ];

    for (const solid of solids) {
      expect(gridManager.isWalkable(mapName, solid[0], solid[1])).toBe(false);
    }

    const nonSolids = [
      [17, 16],
      [18, 17],
      [-7, 13],
      [-12, 29],
      [27, 5],
    ];

    for (const nonSolid of nonSolids) {
      expect(gridManager.isWalkable(mapName, nonSolid[0], nonSolid[1])).toBe(true);
    }
  });

  it("should properly detect solids on a gridX and gridY for Example map", () => {
    const nonSolids = [
      [4, 4],
      [23, 4],
      [4, 15],
      [23, 15],
      [14, 50],
    ];

    for (const nonSolid of nonSolids) {
      expect(gridManager.isWalkable("example", nonSolid[0], nonSolid[1])).toBe(true);
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
      expect(gridManager.isWalkable("example", solid[0], solid[1])).toBe(false);
    }
  });

  it("should properly find the shortest path between 2 points with negative coordinates", () => {
    const path = gridManager.findShortestPath("unit-test-map-negative-coordinate", -11, 10, -8, 12);

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
  it("should properly find the shortest path between 2 points WITHOUT negative coordinates", () => {
    const path = gridManager.findShortestPath("unit-test-map-negative-coordinate", 15, 24, 17, 25);

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
