/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { UNIT_TESTING_MAPS } from "@providers/constants/MapConstants";
import { mapLoader, unitTestHelper } from "@providers/inversify/container";
import { MapLoader } from "../MapLoader";

describe("MapLoader.ts", () => {
  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();

    await mapLoader.init();
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);
  });

  it("should load the the maps", () => {
    const mapNames = UNIT_TESTING_MAPS;

    for (const mapFileName of mapNames) {
      if (mapFileName.includes("_hash")) {
        continue; // just cache files, skip!
      }

      if (!mapFileName.endsWith(".json")) {
        continue;
      }

      const mapName = mapFileName.replace(".json", "");

      const currentMap = MapLoader.maps.get(mapName);

      expect(currentMap).toBeDefined();
    }
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
