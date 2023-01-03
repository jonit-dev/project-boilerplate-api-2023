/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { container, unitTestHelper } from "@providers/inversify/container";
import { MapLayers } from "@rpg-engine/shared";
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
    const bigRock = mapSolids.isTileSolid(mapName, 17, 23, MapLayers.OverGround);

    const treeTop = mapSolids.isTileSolid(mapName, 23, 5, MapLayers.OverCharacter);

    const noTile = mapSolids.isTileSolid(mapName, 0, 0, MapLayers.Roof);

    expect(bigRock).toBeTruthy();
    expect(treeTop).toBeFalsy();
    expect(noTile).toBeFalsy();
  });

  it("should return true if the tile at the given position on the given map and layer is solid when the isTileSolid method is called with the CHECK_SINGLE_LAYER strategy", () => {
    const mapTilesMock = {
      isSolid: jest.fn().mockReturnValue(true),
    };

    // Create a mock implementation of the MapHelper class that returns the highest map layer
    const mapHelperMock = {
      getHighestMapLayer: jest.fn().mockReturnValue(5),
    };

    // @ts-ignore
    mapSolids.mapTiles = mapTilesMock;

    // @ts-ignore
    mapSolids.mapHelper = mapHelperMock;

    // Call the isTileSolid method with the CHECK_SINGLE_LAYER strategy
    const result = mapSolids.isTileSolid("map1", 1, 2, MapLayers.Ground, "CHECK_SINGLE_LAYER");

    // Assert that the result is true
    expect(result).toBe(true);
  });

  it("should return true if any of the tiles on layers below the given layer at the given position on the given map are solid when the isTileSolid method is called with the CHECK_ALL_LAYERS_BELOW strategy", () => {
    const mapTilesMock = {
      isSolid: jest.fn(),
    };
    const mapHelperMock = {
      getHighestMapLayer: jest.fn(() => 3),
    };

    // @ts-ignore
    mapSolids.mapTiles = mapTilesMock;

    // @ts-ignore
    mapSolids.mapHelper = mapHelperMock;

    // Set up the mock functions to return different values depending on the layer being checked
    mapTilesMock.isSolid.mockImplementation((_map: string, _gridX: number, _gridY: number, layer: MapLayers) => {
      if (layer === MapLayers.Ground) {
        return false;
      } else {
        return true;
      }
    });

    // Test the isTileSolid method with the CHECK_ALL_LAYERS_BELOW strategy
    const result = mapSolids.isTileSolid("map", 0, 0, MapLayers.OverCharacter, "CHECK_ALL_LAYERS_BELOW");

    // Assert that the result is as expected
    expect(result).toBe(true);
  });

  it("should return true if any of the tiles on any layer at the given position on the given map are solid when the isTileSolid method is called with the CHECK_ALL_LAYERS strategy", () => {
    const mapTilesMock = {
      isSolid: jest.fn(),
    };

    // Set up the mock function to return different values depending on the layer being checked
    mapTilesMock.isSolid.mockImplementation((_map: string, _gridX: number, _gridY: number, layer: MapLayers) => {
      if (layer === MapLayers.Ground || layer === MapLayers.OverCharacter) {
        return false;
      } else {
        return true;
      }
    });

    // @ts-ignore
    mapSolids.mapTiles = mapTilesMock;

    // Test the isTileSolid method with the CHECK_ALL_LAYERS strategy
    const result = mapSolids.isTileSolid("map", 0, 0, MapLayers.OverCharacter, "CHECK_ALL_LAYERS");

    // Assert that the result is as expected
    expect(result).toBe(true);
  });

  it("should return false if no tiles at the given position on the given map and layer are solid when the isTileSolid method is called", () => {
    // Mock the mapTiles and mapHelper dependencies of the MapSolids class
    const mapTilesMock = {
      isSolid: jest.fn(),
    };
    // Set up the mock function to always return false
    mapTilesMock.isSolid.mockReturnValue(false);
    // @ts-ignore
    mapSolids.mapTiles = mapTilesMock;

    // Test the isTileSolid method with the CHECK_SINGLE_LAYER strategy
    const result = mapSolids.isTileSolid("map", 0, 0, MapLayers.Ground, "CHECK_SINGLE_LAYER");

    // Assert that the result is as expected
    expect(result).toBe(false);
  });

  it("should return true if the tile at the given position on the given map and layer is a passage when the isTilePassage method is called with the CHECK_SINGLE_LAYER strategy", () => {
    // Mock the mapTiles and mapHelper dependencies of the MapSolids class
    const mapTilesMock = {
      isPassage: jest.fn(),
    };

    // Set up the mock function to return true for any position and layer
    mapTilesMock.isPassage.mockReturnValue(true);

    // @ts-ignore
    mapSolids.mapTiles = mapTilesMock;

    // Test the isTilePassage method with the CHECK_SINGLE_LAYER strategy
    const result = mapSolids.isTilePassage("map", 0, 0, MapLayers.Ground, "CHECK_SINGLE_LAYER");

    // Assert that the result is as expected
    expect(result).toBe(true);
  });

  it("should return true if any of the tiles on layers below the given layer at the given position on the given map are passages when the isTilePassage method is called with the CHECK_ALL_LAYERS_BELOW strategy", () => {
    // Mock the mapTiles and mapHelper dependencies of the MapSolids class
    const mapTilesMock = {
      isPassage: jest.fn(),
    };

    // Set up the mock function to return different values depending on the layer being checked
    mapTilesMock.isPassage.mockImplementation((_map: string, _gridX: number, _gridY: number, layer: MapLayers) => {
      if (layer === MapLayers.Ground) {
        return true;
      } else {
        return false;
      }
    });

    // @ts-ignore
    mapSolids.mapTiles = mapTilesMock;

    // Test the isTilePassage method with the CHECK_ALL_LAYERS_BELOW strategy
    const result = mapSolids.isTilePassage("map", 0, 0, MapLayers.OverCharacter, "CHECK_ALL_LAYERS_BELOW");

    // Assert that the result is as expected
    expect(result).toBe(true);
  });

  it("It should return true if any of the tiles on layers above the given layer at the given position on the given map are passages when the isTilePassage method is called with the CHECK_ALL_LAYERS_ABOVE strategy.", () => {
    // Mock the mapTiles and mapHelper dependencies of the MapSolids class
    const mapTilesMock = {
      isPassage: jest.fn(),
    };

    // Set up the mock function to return different values depending on the layer being checked
    mapTilesMock.isPassage.mockImplementation((_map: string, _gridX: number, _gridY: number, layer: MapLayers) => {
      if (layer === MapLayers.Ground) {
        return false;
      } else {
        return true;
      }
    });

    // @ts-ignore
    mapSolids.mapTiles = mapTilesMock;

    // Test the isTilePassage method with the CHECK_ALL_LAYERS_BELOW strategy
    const result = mapSolids.isTilePassage("map", 0, 0, MapLayers.Ground, "CHECK_ALL_LAYERS_ABOVE");

    // Assert that the result is as expected
    expect(result).toBe(true);
  });

  it("should return true if any of the tiles on any layer at the given position on the given map are passages when the isTilePassage method is called with the CHECK_ALL_LAYERS strategy", () => {
    // Mock the mapTiles and mapHelper dependencies of the MapSolids class
    const mapTilesMock = {
      isPassage: jest.fn(),
    };

    // Set up the mock function to return different values depending on the layer being checked
    mapTilesMock.isPassage.mockImplementation((_map: string, _gridX: number, _gridY: number, layer: MapLayers) => {
      if (layer === MapLayers.Ground) {
        return false;
      } else {
        return true;
      }
    });

    // @ts-ignore
    mapSolids.mapTiles = mapTilesMock;

    // Test the isTilePassage method with the CHECK_ALL_LAYERS strategy
    const result = mapSolids.isTilePassage("map", 0, 0, MapLayers.OverCharacter, "CHECK_ALL_LAYERS");

    // Assert that the result is as expected
    expect(result).toBe(true);
  });

  it("should return false if no tiles at the given position on the given map and layer are passages when the isTilePassage method is called", () => {
    // Mock the mapTiles and mapHelper dependencies of the MapSolids class
    const mapTilesMock = {
      isPassage: jest.fn(),
    };

    // Set up the mock function to always return false
    mapTilesMock.isPassage.mockReturnValue(false);

    // @ts-ignore
    mapSolids.mapTiles = mapTilesMock;

    // Test the isTilePassage method with the CHECK_SINGLE_LAYER strategy
    const result = mapSolids.isTilePassage("map", 0, 0, MapLayers.Ground, "CHECK_SINGLE_LAYER");

    // Assert that the result is as expected
    expect(result).toBe(false);
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
