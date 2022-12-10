import { container, unitTestHelper } from "@providers/inversify/container";
import { MapHelper } from "../MapHelper";

describe("MapHelper", () => {
  let mapHelper: MapHelper;

  beforeAll(async () => {
    mapHelper = container.get<MapHelper>(MapHelper);

    await unitTestHelper.initializeMapLoader();
  });

  it("returns if a coordinate is valid or not", () => {
    const v1 = [0, 0];
    const v2 = [1, 1];

    const invalid1 = [-1, undefined];
    const invalid2 = [undefined, null];
    const invalid3 = [null, undefined];

    expect(mapHelper.areAllCoordinatesValid(v1)).toBeTruthy();
    expect(mapHelper.areAllCoordinatesValid(v2)).toBeTruthy();

    // @ts-expect-error
    expect(mapHelper.areAllCoordinatesValid(invalid1)).toBeFalsy();

    // @ts-expect-error
    expect(mapHelper.areAllCoordinatesValid(invalid2)).toBeFalsy();

    // @ts-expect-error
    expect(mapHelper.areAllCoordinatesValid(invalid3)).toBeFalsy();
  });

  it("gets highest layer", () => {
    const highestLayer = mapHelper.getHighestMapLayer();

    expect(highestLayer).toEqual(6);
  });
});
