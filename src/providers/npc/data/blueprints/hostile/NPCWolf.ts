import { INPC } from "@entities/ModuleNPC/NPCModel";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import { EXP_RATIO } from "@providers/constants/SkillConstants";
import { DaggersBluePrint, FoodsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/item/data/types/npcsBlueprintTypes";
import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcWolf = {
  ...generateMoveTowardsMovement(),
  name: "Wolf",
  key: HostileNPCsBlueprint.Wolf,
  textureKey: HostileNPCsBlueprint.Wolf,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: MovementSpeed.Fast,
  skills: {
    level: 1,
    strength: {
      level: 2,
    },
    dexterity: {
      level: 1,
    },
    resistance: {
      level: 1,
    },
  },
  fleeOnLowHealth: true,
  experience: 8 * EXP_RATIO,
  loots: [
    {
      itemBlueprintKey: FoodsBlueprint.Salmon,
      chance: 20,
    },
    {
      itemBlueprintKey: FoodsBlueprint.Bread,
      chance: 30,
    },
    {
      itemBlueprintKey: DaggersBluePrint.Dagger,
      chance: 30,
    },
  ],
} as Partial<INPC>;
