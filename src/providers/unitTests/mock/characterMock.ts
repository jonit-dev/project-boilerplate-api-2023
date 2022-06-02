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
  gender: "Male",
  totalWeightCapacity: 100,
  isOnline: true,
  attackType: EntityAttackType.Melee,
  scene: "MainScene",
  initialScene: "MainScene",
  name: "Test Character",
  owner: "6233ff328f3b09002fe32f9b",
  channelId: "mock-inexistent-channel-id",
  view: {
    characters: {},
    npcs: {},
    items: {},
  },
};
