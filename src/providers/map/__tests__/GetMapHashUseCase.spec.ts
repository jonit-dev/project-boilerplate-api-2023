/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { STATIC_PATH } from "@providers/constants/PathConstants";
import { container } from "@providers/inversify/container";
import { GetMapMetadataUseCase } from "@useCases/ModuleSystem/map/GetMapMetadataUseCase";

describe("MapLoader.ts", () => {
  let getMapHashUseCase: GetMapMetadataUseCase;

  beforeEach(() => {
    getMapHashUseCase = container.get<GetMapMetadataUseCase>(GetMapMetadataUseCase);
  });

  it("should return the map hash", () => {
    jest.spyOn(getMapHashUseCase, "execute").mockReturnValue({ hash: "123" });

    const mapHash = getMapHashUseCase.execute("another_map");
    expect(mapHash).toEqual({ hash: "123" });
  });

  it("should return error when map not found", () => {
    expect(() => getMapHashUseCase.execute("new_map")).toThrow(
      new Error(`ENOENT: no such file or directory, open '${STATIC_PATH}/maps/new_map.json'`)
    );
  });
});
