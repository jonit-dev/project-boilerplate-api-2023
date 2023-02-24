import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { CharacterFactions, LifeBringerRaces } from "@rpg-engine/shared";
import { Types } from "mongoose";

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
  scene: "example",
  initialScene: "example",
  name: "Test Character",
  owner: "6233ff328f3b09002fe32f9b" as unknown as Types.ObjectId,
  channelId: "mock-inexistent-channel-id",
};
