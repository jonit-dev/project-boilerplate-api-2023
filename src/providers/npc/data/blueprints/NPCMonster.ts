import { INPC } from "@entities/ModuleNPC/NPCModel";
import { CharacterClass, CharacterGender, NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../abstractions/BaseNeutralNPC";

export const npcMonster = {
  ...generateMoveTowardsMovement(),
  name: "Monster",
  key: "monster",
  textureKey: "female-npc",
  class: CharacterClass.None,
  gender: CharacterGender.Female,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: 2.5,
  skills: {
    level: 1,
    strength: 1,
    dexterity: 1,
  },
} as Partial<INPC>;
