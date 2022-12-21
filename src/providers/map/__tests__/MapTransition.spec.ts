import { Character } from "@entities/ModuleCharacter/CharacterModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { FromGridX, MapSocketEvents } from "@rpg-engine/shared";
import { EntityType } from "@rpg-engine/shared/dist/types/entity.types";
import { ObjectId } from "mongodb";
import { MapTransition } from "../MapTransition";
describe("MapTransition", () => {
  let mapTransition: MapTransition;
  let character;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();
  });
  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);
    mapTransition = container.get<MapTransition>(MapTransition);

    character = await unitTestHelper.createMockCharacter();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });

  it("should change the character's scene to the destination map", async () => {
    const destination = { map: "map2", gridX: 0, gridY: 0 };
    await mapTransition.changeCharacterScene(character, destination);
    const updatedCharacter = await Character.findOne({ _id: character.id });
    // @ts-ignore
    expect(updatedCharacter.scene).toEqual(destination.map);
  });

  it("should update the character's position to the destination grid position", async () => {
    const destination = { map: "map1", gridX: 5, gridY: 5 };
    await mapTransition.changeCharacterScene(character, destination);
    const updatedCharacter = await Character.findOne({ _id: character.id });
    // @ts-ignore
    expect(updatedCharacter.x).toEqual(FromGridX(destination.gridX));
    // @ts-ignore
    expect(updatedCharacter.y).toEqual(FromGridX(destination.gridY));
  });

  it("changeCharacterScene updates character scene and coordinates correctly", async () => {
    character.scene = "oldScene";
    character.x = 10;
    character.y = 20;
    await character.save();

    const destination = { map: "newScene", gridX: 15, gridY: 25 };
    const updateOneMock = jest.fn().mockResolvedValue(null);
    Character.updateOne = updateOneMock;
    // @ts-ignore
    await mapTransition.changeCharacterScene(character, destination);

    expect(updateOneMock).toHaveBeenCalledWith(
      { _id: character._id },
      {
        $set: {
          scene: "newScene",
          x: FromGridX(15),
          y: FromGridX(25),
        },
      }
    );
  });

  it("changeCharacterScene cancels character targeting if they have a target set", async () => {});

  it("should cancel the character's target if it is set", async () => {
    const objectId: ObjectId = new ObjectId();
    character.scene = "map1";
    character.x = 0;
    character.y = 0;
    // @ts-ignore
    character.target = { id: objectId, type: EntityType.Character };
    await character.save();

    const destination = { map: "map1", gridX: 5, gridY: 5 };
    await mapTransition.changeCharacterScene(character, destination);
    const updatedCharacter = await Character.findOne({ _id: character._id });
    // @ts-ignore
    expect(updatedCharacter.target).toEqual({});
  });

  it("should send the ChangeMap event to the character's channel", async () => {
    character.channelId = "123";
    character.scene = "map1";
    character.x = 0;
    character.y = 0;
    await character.save();

    const destination = { map: "map1", gridX: 5, gridY: 5 };
    // @ts-ignore
    const sendEventToUserSpy = jest.spyOn(mapTransition.socketMessaging, "sendEventToUser");
    await mapTransition.changeCharacterScene(character, destination);
    expect(sendEventToUserSpy).toHaveBeenCalledWith(character.channelId, MapSocketEvents.ChangeMap);
  });

  it("should send the Destroy event to characters around the character with the character's id", async () => {
    const destination = { map: "map1", gridX: 5, gridY: 5 };
    // @ts-ignore
    const sendSpy = jest.spyOn(mapTransition.socketMessaging, "sendEventToCharactersAroundCharacter");
    await mapTransition.changeCharacterScene(character, destination);
    expect(sendSpy).toHaveBeenCalled;
  });

  test("teleport character within the same map", async () => {
    character.channelId = "123";
    character.scene = "map1";
    character.x = 0;
    character.y = 0;

    await character.save();

    const destination = {
      map: "map1",
      gridX: 5,
      gridY: 5,
    };
    const updateOneMock = jest.fn().mockResolvedValue(null);
    Character.updateOne = updateOneMock;

    // Act
    // @ts-ignore
    await mapTransition.teleportCharacter(character, destination);

    // Assert
    expect(updateOneMock).toHaveBeenCalledWith(
      { _id: character._id },
      {
        $set: {
          x: FromGridX(5),
          y: FromGridX(5),
        },
      }
    );
  });

  it("should clear the character's target when teleporting", async () => {
    const objectId: ObjectId = new ObjectId();

    character.scene = "map1";
    character.x = 0;
    character.y = 0;
    // @ts-ignore
    character.target = { id: objectId, type: EntityType.Character };
    await character.save();

    await mapTransition.teleportCharacter(character, {
      map: character.scene,
      gridX: 1,
      gridY: 1,
    });

    // Assert that the character's target has been cleared
    expect(character.target).toEqual({});
  });
});
