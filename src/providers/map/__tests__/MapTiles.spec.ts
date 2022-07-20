/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { container, mapLoader, unitTestHelper } from "@providers/inversify/container";
import { MapLayers } from "@rpg-engine/shared";
import { MapTiles } from "../MapTiles";

describe("MapTiles.ts", () => {
  let mapTiles: MapTiles;
  const mapName = "unit-test-map";

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();

    await mapLoader.init();
    mapTiles = container.get<MapTiles>(MapTiles);
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);
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
    expect(tileProperty).toBe("a big rock.");
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

  it("should properly get the tileId and solid status of a flipped tile", () => {
    const flippedTileId = mapTiles.getTileId(mapName, 19, 16, MapLayers.OverGround);
    const solidFlippedTile = mapTiles.isSolid(mapName, 19, 16, MapLayers.OverGround);

    expect(flippedTileId).toBe(35);
    expect(solidFlippedTile).toBeTruthy();
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
