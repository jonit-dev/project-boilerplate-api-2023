import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { MapTransitionInfo } from "../MapTransitionInfo";

describe("MapTransitionInfo.spec.ts", () => {
  let mapTransitionInfo: MapTransitionInfo;
  let testCharacter: ICharacter;

  beforeAll(() => {
    mapTransitionInfo = container.get(MapTransitionInfo);
  });

  beforeEach(async () => {
    testCharacter = await unitTestHelper.createMockCharacter();
  });

  it("should return undefine if there are no transitions in the map", () => {
    // Call the getTransitionAtXY method
    const result = mapTransitionInfo.getTransitionAtXY(testCharacter.scene, 0, 0);

    // Assert that the result is null
    expect(result).toBeUndefined();
  });
});
