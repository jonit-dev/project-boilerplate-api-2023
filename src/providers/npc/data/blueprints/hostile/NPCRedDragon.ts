import { INPC } from "@entities/ModuleNPC/NPCModel";
import { EXP_RATIO } from "@providers/constants/SkillConstants";
import { SwordBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/item/data/types/npcsBlueprintTypes";
import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcRedDragon = {
  ...generateMoveTowardsMovement(),
  name: "Red Dragon",
  key: HostileNPCsBlueprint.RedDragon,
  textureKey: HostileNPCsBlueprint.RedDragon,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: 4,
  skills: {
    level: 50,
    strength: {
      level: 50,
    },
    dexterity: {
      level: 30,
    },
  },
  fleeOnLowHealth: true,
  experience: 1400 * EXP_RATIO,
  loots: [
    {
      itemBlueprintKey: SwordBlueprint.DragonsSword,
      chance: 40,
    },
  ],
} as Partial<INPC>;
