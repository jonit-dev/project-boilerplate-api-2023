import { INPC } from "@entities/ModuleNPC/NPCModel";
import { CharacterClass, CharacterGender, NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../abstractions/BaseNeutralNPC";

export const npcMonsterMetaData = {
  ...generateMoveTowardsMovement(),
  key: "monster",
  name: "Monster",
  textureKey: "female-npc",
  scene: "MainScene",
  class: CharacterClass.None,
  gender: CharacterGender.Female,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  skills: {
    level: 1,
    strength: 1,
    dexterity: 1,
  },
} as Partial<INPC>;
