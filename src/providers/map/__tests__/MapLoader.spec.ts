/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { mapLoader, unitTestHelper } from "@providers/inversify/container";
import { MapLoader } from "../MapLoader";
import { STATIC_PATH } from "@providers/constants/PathConstants";
import fs from "fs";

describe("MapLoader.ts", () => {
  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();
    mapLoader.init();
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);
  });

  it("should load the the maps", () => {
    const mapNames = fs.readdirSync(STATIC_PATH + "/maps");

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

  it("should load the the grid", () => {
    const mapNames = fs.readdirSync(STATIC_PATH + "/maps");

    for (const mapFileName of mapNames) {
      if (mapFileName.includes("_hash")) {
        continue; // just cache files, skip!
      }

      if (!mapFileName.endsWith(".json")) {
        continue;
      }

      const mapName = mapFileName.replace(".json", "");

      const currentGrid = MapLoader.grids.get(mapName);

      expect(currentGrid).toBeDefined();
    }
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
