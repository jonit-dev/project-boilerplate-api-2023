import { INPC } from "@entities/ModuleNPC/NPCModel";
import { CharacterClass, CharacterGender } from "@rpg-engine/shared";
import { generateFixedPathMovement } from "../abstractions/BaseNeutralNPC";

export const npcAlice = {
  ...generateFixedPathMovement(),
  name: "Alice",
  textureKey: "female-npc",
  key: "alice",
  class: CharacterClass.None,
  gender: CharacterGender.Female,
} as Partial<INPC>;
