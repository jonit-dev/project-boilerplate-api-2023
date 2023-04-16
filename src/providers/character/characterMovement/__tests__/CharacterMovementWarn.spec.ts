import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container } from "@providers/inversify/container";
import { CharacterMovementWarn } from "../CharacterMovementWarn";
import { CharacterView } from "@providers/character/CharacterView";

describe("CharacterMovementWarn", () => {
  let characterMovementWarn: CharacterMovementWarn;
  let getCharactersInViewMock: jest.SpyInstance;

  const mockGetCharactersInViewMock = (value: ICharacter[]): void => {
    getCharactersInViewMock && getCharactersInViewMock.mockRestore();
    getCharactersInViewMock = jest
      .spyOn(CharacterView.prototype, "getCharactersInView")
      .mockImplementation(jest.fn().mockReturnValue(value));
  };

  beforeEach(() => {
    mockGetCharactersInViewMock([]);
  });

  afterEach(() => {
    getCharactersInViewMock.mockRestore();
  });

  beforeAll(() => {
    characterMovementWarn = container.get(CharacterMovementWarn);
  });

  it("it warns characters around about position update", async () => {
    const character = {
      type: "Fake",
      _id: "fake-id",
      channelId: "fake-channel-id",
    } as ICharacter;

    await (characterMovementWarn as any).warnCharactersAroundAboutEmitterPositionUpdate(character, {});

    expect(getCharactersInViewMock).toHaveBeenCalledWith(character);
  });

  describe("warn emitter about characters around", () => {
    const character = {
      _id: "fake_id",
      id: "fake-id",
      name: "Fake Name",
      x: 100,
      y: 200,
      direction: "down",
      scene: "fake-scene",
    };

    const testCharacter = {
      id: "fake-id-2",
    };

    let elementOnViewMock: jest.SpyInstance;
    let addToViewMock: jest.SpyInstance;

    beforeEach(() => {
      mockGetCharactersInViewMock([character as unknown as ICharacter]);

      elementOnViewMock = jest
        .spyOn(CharacterView.prototype, "getElementOnView")
        .mockImplementation(jest.fn().mockReturnValue(Promise.resolve(false)));
      addToViewMock = jest.spyOn(CharacterView.prototype, "addToCharacterView").mockImplementation();
    });

    afterEach(() => {
      elementOnViewMock.mockRestore();
      addToViewMock.mockRestore();
    });

    it("it warns emitter about character around", async () => {
      await (characterMovementWarn as any).warnEmitterAboutCharactersAround(testCharacter as unknown as ICharacter);

      expect(addToViewMock).toHaveBeenCalledWith(
        testCharacter,
        {
          id: character.id,
          x: character.x,
          y: character.y,
          direction: character.direction,
          scene: character.scene,
        },
        "characters"
      );

      expect(elementOnViewMock).toHaveBeenCalledWith(testCharacter, character._id, "characters");
    });
  });
});
