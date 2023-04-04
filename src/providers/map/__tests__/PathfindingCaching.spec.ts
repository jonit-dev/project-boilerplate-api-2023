import { container } from "@providers/inversify/container";
import { PathfindingCaching } from "../PathfindingCaching";

describe("PathfindingCaching", () => {
  let pathfindingCaching: PathfindingCaching;

  beforeAll(() => {
    pathfindingCaching = container.get(PathfindingCaching);
  });

  it("should set the cache properly", async () => {
    const map = "example";
    const gridCoordinates = {
      start: { x: 1, y: 2 },
      end: { x: 3, y: 4 },
    };
    const calculatedPathfinding = [
      [1, 2],
      [3, 4],
    ];

    await pathfindingCaching.set(map, gridCoordinates, calculatedPathfinding);

    const cachedPathfinding = await pathfindingCaching.get(map, gridCoordinates);

    expect(cachedPathfinding).toEqual(calculatedPathfinding);
  });

  it("should return undefined if the cache is old", async () => {
    const oldMapVersion = "1.0.0";
    const newMapVersion = "2.0.0";
    const map = "example";
    const gridCoordinates = {
      start: { x: 1, y: 2 },
      end: { x: 3, y: 4 },
    };
    const calculatedPathfinding = [
      [1, 2],
      [3, 4],
    ];

    // Mock the getMapVersion method
    // @ts-ignore
    const originalGetMapVersion = pathfindingCaching.getMapVersion;

    // @ts-ignore
    pathfindingCaching.getMapVersion = jest.fn().mockReturnValue(oldMapVersion);

    await pathfindingCaching.set(map, gridCoordinates, calculatedPathfinding);

    // Simulate an update in the map version
    // @ts-ignore
    pathfindingCaching.getMapVersion = jest.fn().mockReturnValue(newMapVersion);

    const cachedPathfinding = await pathfindingCaching.get(map, gridCoordinates);

    expect(cachedPathfinding).toBeUndefined();

    // Restore the original getMapVersion method
    // @ts-ignore
    pathfindingCaching.getMapVersion = originalGetMapVersion;
  });

  it("should throw an error when map version is not found", async () => {
    const map = "nonexistentMap";
    const gridCoordinates = {
      start: { x: 1, y: 2 },
      end: { x: 3, y: 4 },
    };
    const calculatedPathfinding = [
      [1, 2],
      [3, 4],
    ];

    await expect(pathfindingCaching.set(map, gridCoordinates, calculatedPathfinding)).rejects.toThrowError(
      `Map version not found for map: ${map}`
    );
  });
});
