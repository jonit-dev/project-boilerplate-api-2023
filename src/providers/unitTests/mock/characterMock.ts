import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { CharacterFactions, LifeBringerRaces } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";

export const characterMock: Partial<ICharacter> = {
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
  channelId: "mock-inexistent-channel-id",
  view: {
    characters: {},
    npcs: {},
    items: {},
  },
};
