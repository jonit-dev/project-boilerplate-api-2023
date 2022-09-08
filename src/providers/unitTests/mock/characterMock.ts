import { CharacterFactions, LifeBringerRaces } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";

export const characterMock = {
  cameraCoordinates: {
    x: -43.0000000000007,
    y: -141.75,
    width: 566,
    height: 827.5,
  },
  health: 100,
  mana: 100,
  x: 304,
  y: 112,
  direction: "left",
  class: "None",
  faction: CharacterFactions.LifeBringer,
  race: LifeBringerRaces.Human,
  textureKey: "kid-1",
  totalWeightCapacity: 100,
  isOnline: true,
  attackType: EntityAttackType.Melee,
  scene: "example",
  initialScene: "example",
  name: "Test Character",
  owner: "6233ff328f3b09002fe32f9b",
  channelId: "mock-inexistent-channel-id",
  view: {
    characters: {},
    npcs: {},
    items: {},
  },
};
