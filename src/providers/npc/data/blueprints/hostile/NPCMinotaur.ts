import { INPC } from "@entities/ModuleNPC/NPCModel";
import {
  BootsBlueprint,
  GlovesBlueprint,
  SpearsBlueprint,
  SwordBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/item/data/types/npcsBlueprintTypes";

import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcMinotaur = {
  ...generateMoveTowardsMovement(),
  name: "Minotaur",
  key: HostileNPCsBlueprint.Minotaur,
  textureKey: HostileNPCsBlueprint.Minotaur,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: 5,
  skills: {
    level: 3,
    strength: {
      level: 3,
    },
    dexterity: {
      level: 2,
    },
    resistance: {
      level: 3,
    },
  },
  fleeOnLowHealth: true,
  experience: 16,
  loots: [
    {
      itemBlueprintKey: SwordBlueprint.DragonsSword,
      chance: 10,
    },
    {
      itemBlueprintKey: BootsBlueprint.CopperBoots,
      chance: 20,
    },
    {
      itemBlueprintKey: SpearsBlueprint.RoyalSpear,
      chance: 5,
    },
    {
      itemBlueprintKey: GlovesBlueprint.PlateGloves,
      chance: 15,
    },
  ],
} as Partial<INPC>;
