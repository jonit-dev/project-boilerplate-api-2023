import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { container } from "@providers/inversify/container";
import { ISolidSnapshot, MapSolidsStorage } from "../storage/MapSolidsStorage";

describe("MapSolidsStorage", () => {
  let mapSolidsStorage: MapSolidsStorage;
  const map = "map1";
  const solidsSnapshot: ISolidSnapshot = {
    "1:2:3": true,
  };

  let inMemoryHashSetSpy: jest.SpyInstance;
  let inMemoryHashTableGetSpy: jest.SpyInstance;
  let inMemoryHashTableHasSpy: jest.SpyInstance;
  let inMemoryHashTableDeleteSpy: jest.SpyInstance;

  beforeEach(() => {
    inMemoryHashSetSpy = jest.spyOn(InMemoryHashTable.prototype, "set");
    inMemoryHashTableGetSpy = jest.spyOn(InMemoryHashTable.prototype, "get");
    inMemoryHashTableHasSpy = jest.spyOn(InMemoryHashTable.prototype, "has");
    inMemoryHashTableDeleteSpy = jest.spyOn(InMemoryHashTable.prototype, "delete");

    mapSolidsStorage = container.get(MapSolidsStorage);
  });

  afterEach(() => {
    // Clean up after each test
    inMemoryHashSetSpy.mockRestore();
    inMemoryHashTableGetSpy.mockRestore();
    inMemoryHashTableHasSpy.mockRestore();
    inMemoryHashTableDeleteSpy.mockRestore();
  });

  it("should save the snapshot", async () => {
    await mapSolidsStorage.saveSolidsSnapshot(map, solidsSnapshot);
    expect(inMemoryHashSetSpy).toBeCalled();
  });

  it("should read the snapshot", async () => {
    inMemoryHashTableGetSpy.mockReturnValueOnce(
      // @ts-ignore
      Promise.resolve(JSON.stringify(Array.from(Object.keys(solidsSnapshot))))
    );

    await mapSolidsStorage.readSolidsSnapshot(map);
    expect(inMemoryHashTableGetSpy).toBeCalled();
  });

  it("should return true when snapshot exists", async () => {
    inMemoryHashTableHasSpy.mockReturnValueOnce(Promise.resolve(true));
    const result = await mapSolidsStorage.hasSolidSnapshot(map);
    expect(result).toBe(true);
    expect(inMemoryHashTableHasSpy).toBeCalledWith("map-solids", map);
  });

  it("should return false when snapshot does not exist", async () => {
    inMemoryHashTableHasSpy.mockReturnValueOnce(Promise.resolve(false));
    const result = await mapSolidsStorage.hasSolidSnapshot(map);
    expect(result).toBe(false);
    expect(inMemoryHashTableHasSpy).toBeCalledWith("map-solids", map);
  });

  it("should delete the snapshot", async () => {
    await mapSolidsStorage.deleteSolidsSnapshot(map);
    expect(inMemoryHashTableDeleteSpy).toBeCalled();
  });

  it("should throw error when trying to read non-existent snapshot", async () => {
    inMemoryHashTableGetSpy.mockReturnValueOnce(Promise.resolve(null));

    await expect(mapSolidsStorage.readSolidsSnapshot(map)).rejects.toThrowError(
      "❌Could not find solids snapshot for map: " + map
    );
  });

  it("should return undefined when trying to check solidity of non-existent snapshot", () => {
    const result = mapSolidsStorage.isSolid(map, 1, 2, 3);

    expect(result).toBe(undefined);
  });

  it("should return true if a solid exists", async () => {
    // @ts-ignore
    inMemoryHashTableGetSpy.mockReturnValueOnce(
      Promise.resolve(JSON.stringify(Array.from(Object.keys(solidsSnapshot))))
    );

    // Save and then read the snapshot to the internal mapSolids variable
    await mapSolidsStorage.saveSolidsSnapshot(map, solidsSnapshot);
    await mapSolidsStorage.readSolidsSnapshot(map);

    const result = mapSolidsStorage.isSolid(map, 1, 2, 3);
    expect(result).toBe(true);
  });
});
