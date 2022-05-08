import { INPC } from "@entities/ModuleNPC/NPCModel";
import { CharacterClass, CharacterGender, NPCAlignment, NPCAttackType } from "@rpg-engine/shared";
import { generateMoveTowardsMovement } from "./abstractions/BaseNeutralNPC";

export const npcMonsterMetaData = {
  ...generateMoveTowardsMovement(),
  key: "monster",
  name: "Monster",
  textureKey: "female-npc",
  scene: "MainScene",
  class: CharacterClass.None,
  gender: CharacterGender.Female,
  alignment: NPCAlignment.Hostile,
  attackType: NPCAttackType.Melee,
  skills: {
    level: 1,
    strength: 1,
  },
} as Partial<INPC>;
