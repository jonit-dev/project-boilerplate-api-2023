import { INPC } from "@entities/ModuleNPC/NPCModel";
import { CharacterClass, CharacterGender } from "@rpg-engine/shared";
import { generateMoveAwayMovement } from "../abstractions/BaseNeutralNPC";

export const npcAnnie = {
  ...generateMoveAwayMovement(),
  name: "Annie",
  textureKey: "woman-1",
  scene: "MainScene",
  key: "annie",
  class: CharacterClass.None,
  gender: CharacterGender.Female,
} as Partial<INPC>;
