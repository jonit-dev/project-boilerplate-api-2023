import { INPC } from "@entities/ModuleNPC/NPCModel";
import { CharacterClass, CharacterGender } from "@rpg-engine/shared";
import { generateMoveTowardsMovement } from "./abstractions/BaseNeutralNPC";

export const npcFeliciaMetaData = {
  ...generateMoveTowardsMovement(),
  key: "felicia",
  name: "Felicia",
  textureKey: "female-npc",
  scene: "MainScene",
  class: CharacterClass.None,
  gender: CharacterGender.Female,
} as Partial<INPC>;
