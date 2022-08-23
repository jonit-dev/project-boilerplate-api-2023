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
    const bigRock = mapSolids.isTileSolid(mapName, 17, 22, MapLayers.OverGround);

    const treeTop = mapSolids.isTileSolid(mapName, 23, 5, MapLayers.OverCharacter);

    const noTile = mapSolids.isTileSolid(mapName, 0, 0, MapLayers.Roof);

    expect(bigRock).toBeTruthy();
    expect(treeTop).toBeFalsy();
    expect(noTile).toBeFalsy();
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
