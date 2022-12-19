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

  it("returns the correct key in the returned object", () => {
    const tiledData = {
      id: 1,
      x: 0,
      y: 0,
      properties: [{ name: "key", value: "test-key" }],
    };
    const mapName = "test-map";
    const blueprintIndex = {
      "test-key": { foo: "bar" },
    };
    const additionalProperties = { baz: "qux" };
    // @ts-ignore
    const result = mapHelper.mergeBlueprintWithTiledProps(tiledData, mapName, blueprintIndex, additionalProperties);

    expect(result.key).toEqual("test-key-1");
  });

  it("returns the correct data in the returned object", () => {
    const tiledData = {
      id: 1,
      x: 0,
      y: 0,
      properties: [{ name: "key", value: "test-key" }],
    };
    const mapName = "test-map";
    const blueprintIndex = {
      "test-key": { foo: "bar" },
    };
    const additionalProperties = { baz: "qux" };
    // @ts-ignore
    const result = mapHelper.mergeBlueprintWithTiledProps(tiledData, mapName, blueprintIndex, additionalProperties);

    expect(result.data).toEqual({
      foo: "bar",
      key: "test-key-1",
      tiledId: 1,
      x: 0,
      y: 0,
      scene: "test-map",
      baz: "qux",
    });
  });

  it("returns the correct x and y coordinates in the returned object", () => {
    const tiledData = {
      id: 1,
      x: 10,
      y: 20,
      properties: [{ name: "key", value: "test-key" }],
    };
    const mapName = "test-map";
    const blueprintIndex = {
      "test-key": { foo: "bar" },
    };
    const additionalProperties = { baz: "qux" };
    // @ts-ignore
    const result = mapHelper.mergeBlueprintWithTiledProps(tiledData, mapName, blueprintIndex, additionalProperties);

    expect(result.data).toEqual({
      foo: "bar",
      key: "test-key-1",
      tiledId: 1,
      x: 10,
      y: 20,
      scene: "test-map",
      baz: "qux",
    });
  });

  it("returns the correct scene name in the returned object", () => {
    const tiledData = {
      id: 1,
      x: 0,
      y: 0,
      properties: [{ name: "key", value: "test-key" }],
    };
    const mapName = "test-map";
    const blueprintIndex = {
      "test-key": { foo: "bar" },
    };
    const additionalProperties = { baz: "qux" };
    // @ts-ignore
    const result = mapHelper.mergeBlueprintWithTiledProps(tiledData, mapName, blueprintIndex, additionalProperties);

    expect(result.data).toEqual({
      foo: "bar",
      key: "test-key-1",
      tiledId: 1,
      x: 0,
      y: 0,
      scene: "test-map",
      baz: "qux",
    });
  });

  it("throws an error if the mapName argument is not provided", () => {
    const tiledData = {
      id: 1,
      x: 0,
      y: 0,
      properties: [{ name: "key", value: "test-key" }],
    };
    const blueprintIndex = {
      "test-key": { foo: "bar" },
    };
    const additionalProperties = { baz: "qux" };

    expect(() => {
      // @ts-ignore
      mapHelper.mergeBlueprintWithTiledProps(tiledData, null, blueprintIndex, additionalProperties);
    }).toThrowError("NPCLoader: Map name is for map null");
  });
});
