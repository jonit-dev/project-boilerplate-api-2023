/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { container, unitTestHelper } from "@providers/inversify/container";
import { MapLayers } from "@rpg-engine/shared";
import { MapLoader } from "../MapLoader";
import { MapSolids } from "../MapSolids";

describe("MapSolids.ts", () => {
  let mapSolids: MapSolids;
  const mapName = "unit-test-map";

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();

    await unitTestHelper.initializeMapLoader();
    mapSolids = container.get<MapSolids>(MapSolids);
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);
  });

  it("should properly detect if a tile is solid or not", () => {
    const bigRock = mapSolids.isTileSolid(mapName, 17, 22, MapLayers.OverGround);

    const treeTop = mapSolids.isTileSolid(mapName, 23, 5, MapLayers.OverCharacter);

    const noTile = mapSolids.isTileSolid(mapName, 0, 0, MapLayers.Roof);

    expect(bigRock).toBeTruthy();
    expect(treeTop).toBeFalsy();
    expect(noTile).toBeFalsy();
  });

  describe("Grid solids generation", () => {
    it("should properly generate grid solids", () => {
      const mapData = MapLoader.maps.get(mapName);
      const gridMap = MapLoader.grids.get(mapName);

      if (!gridMap) {
        throw new Error("Failed to get grid map");
      }

      if (!mapData) {
        throw new Error("Failed to get map data");
      }

      mapSolids.generateGridSolids(mapName, mapData);

      const solidPoints = [
        [7, 14],
        [17, 14],
        [27, 14],
        [8, 23],
        [17, 23],
        [27, 23],
        [13, 11],
        [22, 11],
        [13, 20],
        [22, 20],
        [17, 15],
        [16, 16],
        [19, 17], // flipped tile
        [18, 18], // flipped tile
      ];

      const emptyPoints = [
        [3, 8],
        [17, 9],
        [23, 18],
        [12, 18],
        [28, 28],
        [17, 16],
        [18, 17],
      ];

      for (const [gridX, gridY] of solidPoints) {
        expect(gridMap.isWalkableAt(gridX, gridY)).toBeFalsy();
      }

      for (const [gridX, gridY] of emptyPoints) {
        expect(gridMap.isWalkableAt(gridX, gridY)).toBeTruthy();
      }
    });
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
