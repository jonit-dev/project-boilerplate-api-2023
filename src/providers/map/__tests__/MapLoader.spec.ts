/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { UNIT_TESTING_MAPS } from "@providers/constants/MapConstants";
import { mapLoader } from "@providers/inversify/container";
import { MapLoader } from "../MapLoader";

describe("MapLoader.ts", () => {
  beforeAll(async () => {
    await mapLoader.init();
  });

  beforeEach(async () => {});

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
});
