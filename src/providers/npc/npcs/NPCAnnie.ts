import { CharacterClass, CharacterGender } from "@rpg-engine/shared";
import { generateMoveAwayMovement } from "./abstractions/BaseNeutralNPC";

export const npcAnnieMetaData = {
  ...generateMoveAwayMovement(),
  key: "annie",
  name: "Annie",
  textureKey: "female-npc",
  scene: "MainScene",
  class: CharacterClass.None,
  gender: CharacterGender.Female,
};
