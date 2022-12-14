/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { container, unitTestHelper } from "@providers/inversify/container";
import { MapLayers } from "@rpg-engine/shared";
import { GridManager } from "../GridManager";
import { MapTiles } from "../MapTiles";

describe("MapTiles.ts", () => {
  let mapTiles: MapTiles;
  let gridManager: GridManager;
  const mapName = "unit-test-map";

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();

    await unitTestHelper.initializeMapLoader();
    mapTiles = container.get<MapTiles>(MapTiles);
    gridManager = container.get<GridManager>(GridManager);
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);
  });

  it("should detect if all layers are empty", () => {
    // @ts-ignore
    const allLayersEmpty = mapTiles.areAllLayersTileEmpty(mapName, -10, -10);

    // @ts-ignore
    const layersAreNotEmpty = mapTiles.areAllLayersTileEmpty(mapName, 0, 0);

    expect(allLayersEmpty).toBeTruthy();

    expect(layersAreNotEmpty).toBeFalsy();
  });

  it("detects an is_passage property", () => {
    const isPassage = mapTiles.isPassage(mapName, 3, 7, MapLayers.Decoration);

    const notPassage = mapTiles.isPassage(mapName, 4, 7, MapLayers.OverGround);
    expect(isPassage).toBeTruthy();
    expect(notPassage).toBeFalsy();
  });

  it("should properly get the first X and Y coordinates", () => {
    const firstXY = mapTiles.getFirstXY("unit-test-map-negative-coordinate", MapLayers.Ground);

    expect(firstXY).toEqual([-16, 0]);
  });

  it("should properly calculate the correct map width and height", () => {
    const { gridOffsetX, gridOffsetY } = gridManager.getGridOffset("unit-test-map-negative-coordinate")!;

    const { width, height } = mapTiles.getMapWidthHeight("unit-test-map-negative-coordinate", gridOffsetX, gridOffsetY);

    expect(width).toEqual(48);
    expect(height).toEqual(32);
  });

  it("should properly get a tile id", () => {
    const tileId = mapTiles.getTileId(mapName, 8, 23, MapLayers.OverGround);
    const tileId2 = mapTiles.getTileId(mapName, 17, 13, MapLayers.OverGround);
    const tileId3 = mapTiles.getTileId(mapName, 23, 5, MapLayers.OverCharacter);
    expect(tileId).toBe(961);
    expect(tileId2).toBe(828);
    expect(tileId3).toBe(609);
  });

  it("should properly get a tile property (ge_collide)", () => {
    const tileId = mapTiles.getTileId(mapName, 8, 23, MapLayers.OverGround);

    if (!tileId) {
      throw new Error("Failed to get tileId");
    }

    const tileset = mapTiles.getTilesetFromRawTileId(mapName, tileId);

    if (!tileset) {
      throw new Error("Failed to get tileset");
    }

    const tileProperty = mapTiles.getTileProperty(tileset, tileId, "ge_collide");

    expect(tileProperty).toBeDefined();
    expect(tileProperty).toBeTruthy();
  });

  it("should properly get the tile description", () => {
    const tileId = mapTiles.getTileId(mapName, 8, 23, MapLayers.OverGround);

    if (!tileId) {
      throw new Error("Failed to get tileId");
    }

    const tileset = mapTiles.getTilesetFromRawTileId(mapName, tileId);

    if (!tileset) {
      throw new Error("Failed to get tileset");
    }

    const tileProperty = mapTiles.getTileProperty(tileset, tileId, "description");

    expect(tileProperty).toBeDefined();
    expect(tileProperty).toBe("a giant rock.");
  });

  it("should return the proper tileset, given a tileId", () => {
    const tileset = mapTiles.getTilesetFromRawTileId(mapName, 827);
    const tileset2 = mapTiles.getTilesetFromRawTileId(mapName, 3730);

    if (!tileset || !tileset2) {
      throw new Error("Failed to get tileset");
    }

    expect(tileset.name).toBe("forest");
    expect(tileset2.name).toBe("Village_Tileset");
  });

  it("should properly check if a tile is solid or not", () => {
    const forestSolidTile = mapTiles.isSolid(mapName, 17, 13, MapLayers.OverGround);
    const villageSolidTile = mapTiles.isSolid(mapName, 16, 11, MapLayers.OverGround);
    const emptyTile = mapTiles.isSolid(mapName, 18, 16, MapLayers.OverGround);
    expect(forestSolidTile).toBeTruthy();
    expect(villageSolidTile).toBeTruthy();
    expect(emptyTile).toBeFalsy();
  });

  it("should detect a ge_collide_all property", () => {
    const isFullSolid = mapTiles.isSolid(mapName, 4, 6, MapLayers.Character);
    const isNotFullSolid = mapTiles.isSolid(mapName, 6, 6, MapLayers.OverCharacter);

    expect(isFullSolid).toBeTruthy();
    expect(isNotFullSolid).toBeFalsy();
  });

  it("should check if a tile is solid or not, in a negative coordinate", () => {
    const solids = [
      [-16, 0],
      [31, 31],
      [-10, 10],
      [-5, 10],
      [-9, 12],
      [-10, 15],
      [-7, 16],
    ];

    for (const solid of solids) {
      const solidTile = mapTiles.isSolid("unit-test-map-negative-coordinate", solid[0], solid[1], MapLayers.OverGround);

      expect(solidTile).toBeTruthy();
    }

    const nonSolids = [
      [31, 0],
      [-16, 31],
      [17, 16],
      [18, 17],
      [14, 12],
      [21, 19],
    ];

    for (const nonSolid of nonSolids) {
      const nonSolidTile = mapTiles.isSolid(
        "unit-test-map-negative-coordinate",
        nonSolid[0],
        nonSolid[1],
        MapLayers.OverGround
      );
      expect(nonSolidTile).toBeFalsy();
    }
  });

  it("should properly get the tileId and solid status of a flipped tile", () => {
    const flippedTileId = mapTiles.getTileId(mapName, 19, 16, MapLayers.OverGround);
    const solidFlippedTile = mapTiles.isSolid(mapName, 19, 16, MapLayers.OverGround);

    expect(flippedTileId).toBe(35);
    expect(solidFlippedTile).toBeTruthy();
  });

  it("should get the layers of a map", () => {
    const layers = mapTiles.getMapLayers(mapName);

    expect(layers).toContain("ground");
    expect(layers).toContain("decoration");
    expect(layers).toContain("over-ground");
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
