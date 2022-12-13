import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container } from "@providers/inversify/container";
import { MapSocketEvents } from "@rpg-engine/shared";
import { MapLoader } from "../MapLoader";
import { MapNonPVPZone } from "../MapNonPVPZone";

describe("MapNonPVPZone", () => {
  let mapNonPVPZone: MapNonPVPZone;

  beforeAll(() => {
    mapNonPVPZone = container.get(MapNonPVPZone);
  });

  describe("MapNonPVPZone.stopCharacterAttack", () => {
    it("should send an event to the client telling it to stop any in-progress PvP combat", () => {
      // mock the character object
      const character = {
        channelId: 123,
      } as unknown as ICharacter;

      // mock the socketMessaging instance
      const socketMessaging = {
        sendEventToUser: jest.fn(),
      };
      // @ts-ignore
      mapNonPVPZone.socketMessaging = socketMessaging as any;

      // call the stopCharacterAttack method with the mocked character
      mapNonPVPZone.stopCharacterAttack(character);

      // assert that the sendEventToUser method was called with the expected arguments
      expect(socketMessaging.sendEventToUser).toHaveBeenCalledWith(123, MapSocketEvents.NonPVPZone);
    });
  });

  describe("MapNonPVPZone.getNonPVPZoneAtXY", () => {
    it("should return true if the given coordinates are inside a non-PvP zone", () => {
      // mock the map data
      const map = {
        name: "testMap",
        objects: [
          {
            // define a non-PvP zone with the given coordinates
            name: "NonPVPZone",
            x: 10,
            y: 10,
            width: 10,
            height: 10,
          },
        ],
      };
      const maps = new Map();
      maps.set(map.name, map);
      MapLoader.maps = maps;

      // mock the mapObjectsLoader instance
      const mapObjectsLoader = {
        getObjectLayerData: jest.fn(() => map.objects),
      };
      // @ts-ignore
      mapNonPVPZone.mapObjectsLoader = mapObjectsLoader as any;

      // call the getNonPVPZoneAtXY method with the mocked map data and the coordinates inside the non-PvP zone
      const result = mapNonPVPZone.getNonPVPZoneAtXY(map.name, 15, 15);

      // assert that the result is true
      expect(result).toBe(true);
    });

    it("should return false if there is no map with the given name", () => {
      // mock the map data
      const maps = new Map();

      MapLoader.maps = maps;

      // call the getNonPVPZoneAtXY method with a map name that does not exist in the maps

      // expect to throw an error
      expect(() => mapNonPVPZone.getNonPVPZoneAtXY("nonExistingMap", 0, 0)).toThrowError(
        'MapNonPVPZone: Map "nonExistingMap" is not found!'
      );
    });

    it("should return false if there is no non-PvP zone data for the given map", () => {
      // mock the map data
      const maps = new Map();
      maps.set("existingMap", {});

      MapLoader.maps = maps;

      // mock the mapObjectsLoader instance
      const mapObjectsLoader = {
        getObjectLayerData: jest.fn(() => null),
      };
      // @ts-ignore
      mapNonPVPZone.mapObjectsLoader = mapObjectsLoader as any;

      // call the getNonPVPZoneAtXY method with the name of an existing map and some coordinates
      const result = mapNonPVPZone.getNonPVPZoneAtXY("existingMap", 0, 0);

      // assert that the getObjectLayerData method was called with the expected arguments
      expect(mapObjectsLoader.getObjectLayerData).toHaveBeenCalledWith("NonPVPZones", {});
      // assert that the method returns false
      expect(result).toBe(false);
    });
  });
});
