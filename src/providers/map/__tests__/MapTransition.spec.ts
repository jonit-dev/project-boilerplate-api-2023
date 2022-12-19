import { Character } from "@entities/ModuleCharacter/CharacterModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { BattleSocketEvents, FromGridX, MapSocketEvents } from "@rpg-engine/shared";
import { EntityType } from "@rpg-engine/shared/dist/types/entity.types";
import { ObjectId } from "mongodb";
import { MapTransition } from "../MapTransition";
describe("MapTransition", () => {
  let mapTransition: MapTransition;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();
  });
  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);
    mapTransition = container.get<MapTransition>(MapTransition);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });

  it("should change the character's scene to the destination map", async () => {
    const character = new Character({ scene: "map1", x: 0, y: 0 });
    character.owner = character.id;
    character.name = "Test";
    await character.save();
    const destination = { map: "map2", gridX: 0, gridY: 0 };
    await mapTransition.changeCharacterScene(character, destination);
    const updatedCharacter = await Character.findOne({ _id: character.id });
    // @ts-ignore
    expect(updatedCharacter.scene).toEqual(destination.map);
  });

  it("should update the character's position to the destination grid position", async () => {
    const character = new Character({ scene: "map1", x: 0, y: 0 });
    character.owner = character.id;
    character.name = "Test";
    await character.save();
    const destination = { map: "map1", gridX: 5, gridY: 5 };
    await mapTransition.changeCharacterScene(character, destination);
    const updatedCharacter = await Character.findOne({ _id: character.id });
    // @ts-ignore
    expect(updatedCharacter.x).toEqual(FromGridX(destination.gridX));
    // @ts-ignore
    expect(updatedCharacter.y).toEqual(FromGridX(destination.gridY));
  });

  test("changeCharacterScene updates character scene and coordinates correctly", async () => {
    const character = { _id: "123", scene: "oldScene", x: 10, y: 20, target: {} };
    const id = character._id;
    character.scene = "oldScene";
    character.x = 10;
    character.y = 20;
    const destination = { map: "newScene", gridX: 15, gridY: 25 };
    const updateOneMock = jest.fn().mockResolvedValue(null);
    Character.updateOne = updateOneMock;
    // @ts-ignore
    await mapTransition.changeCharacterScene(character, destination);

    expect(updateOneMock).toHaveBeenCalledWith(
      { _id: id },
      {
        $set: {
          scene: "newScene",
          x: FromGridX(15),
          y: FromGridX(25),
        },
      }
    );
  });

  test("changeCharacterScene cancels character targeting if they have a target set", async () => {
    const character = {
      _id: "123",
      scene: "oldScene",
      x: 10,
      y: 20,
      target: { id: "456", type: "enemies" },
      channelId: "789",
    };
    const destination = { map: "newScene", gridX: 15, gridY: 25 };
    const updateOneMock = jest.fn().mockResolvedValue(null);
    Character.updateOne = updateOneMock;
    const sendEventToUserMock = jest.fn().mockResolvedValue(null);
    const stopTargetingMock = jest.fn().mockResolvedValue(null);
    const mapTransition = new MapTransition(
      // @ts-ignore
      {}, // mock MapObjectsLoader
      { sendEventToUser: sendEventToUserMock }, // mock SocketMessaging
      { stopTargeting: stopTargetingMock } // mock BattleNetworkStopTargeting
    );
    // @ts-ignore
    await mapTransition.changeCharacterScene(character, destination);
    expect(stopTargetingMock).toHaveBeenCalledWith(character);
    expect(sendEventToUserMock).toHaveBeenCalledWith("789", BattleSocketEvents.CancelTargeting, {
      targetId: "456",
      type: "enemies",
      reason: "Your battle target was lost.",
    });
  });

  it("should cancel the character's target if it is set", async () => {
    const objectId: ObjectId = new ObjectId();
    const character = new Character({
      scene: "map1",
      x: 0,
      y: 0,
      target: { id: objectId, type: EntityType.Character },
    });

    character.owner = character.id;
    character.name = "test";
    await character.save();
    console.log(character.target);
    const destination = { map: "map1", gridX: 5, gridY: 5 };
    await mapTransition.changeCharacterScene(character, destination);
    const updatedCharacter = await Character.findOne({ _id: character._id });
    // @ts-ignore
    expect(updatedCharacter.target).toEqual({});
  });

  it("should send the ChangeMap event to the character's channel", async () => {
    const character = new Character({ scene: "map1", x: 0, y: 0, channelId: "123" });
    const destination = { map: "map1", gridX: 5, gridY: 5 };
    // @ts-ignore
    const sendEventToUserSpy = jest.spyOn(mapTransition.socketMessaging, "sendEventToUser");
    await mapTransition.changeCharacterScene(character, destination);
    expect(sendEventToUserSpy).toHaveBeenCalledWith(character.channelId, MapSocketEvents.ChangeMap);
  });

  it("should send the Destroy event to characters around the character with the character's id", async () => {
    const character = new Character({ scene: "map1", x: 0, y: 0, channelId: "123" });
    const destination = { map: "map1", gridX: 5, gridY: 5 };
    // @ts-ignore
    const sendSpy = jest.spyOn(mapTransition.socketMessaging, "sendEventToCharactersAroundCharacter");
    await mapTransition.changeCharacterScene(character, destination);
    expect(sendSpy).toHaveBeenCalled;
  });

  test("teleport character within the same map", async () => {
    // Arrange
    const character = {
      _id: "char1",
      scene: "map1",
      x: 0,
      y: 0,
      target: {
        id: "",
        type: "",
      },
    };
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
      { _id: "char1" },
      {
        $set: {
          x: FromGridX(5),
          y: FromGridX(5),
        },
      }
    );
  });

  it("should clear the character's target when teleporting", async () => {
    const character = new Character({ scene: "map1", x: 0, y: 0 });
    const objectId: ObjectId = new ObjectId();
    // @ts-ignore
    character.target = { id: objectId, type: EntityType.Character };

    await mapTransition.teleportCharacter(character, {
      map: character.scene,
      gridX: 1,
      gridY: 1,
    });

    // Assert that the character's target has been cleared
    expect(character.target).toEqual({});
  });
});
