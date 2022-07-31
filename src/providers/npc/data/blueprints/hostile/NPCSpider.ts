import { INPC } from "@entities/ModuleNPC/NPCModel";
import { GlovesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/item/data/types/npcsBlueprintTypes";
import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcSpider = {
  ...generateMoveTowardsMovement(),
  name: "Spider",
  key: HostileNPCsBlueprint.Spider,
  textureKey: HostileNPCsBlueprint.Spider,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: 3,
  skills: {
    level: 1,
    strength: {
      level: 2,
    },
    dexterity: {
      level: 3,
    },
    resistance: {
      level: 1,
    },
  },
  fleeOnLowHealth: true,
  experience: 25,
  loots: [
    {
      itemBlueprintKey: GlovesBlueprint.LeatherGloves,
      chance: 10,
    },
  ],
} as Partial<INPC>;