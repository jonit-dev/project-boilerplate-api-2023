import { INPC } from "@entities/ModuleNPC/NPCModel";
import { ArmorsBlueprint, MacesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/item/data/types/npcsBlueprintTypes";
import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcSkeleton = {
  ...generateMoveTowardsMovement(),
  name: "Skeleton",
  key: HostileNPCsBlueprint.Skeleton,
  textureKey: HostileNPCsBlueprint.Skeleton,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: 3,
  skills: {
    level: 1,
    strength: {
      level: 2,
    },
    dexterity: {
      level: 1,
    },
  },
  fleeOnLowHealth: true,
  experience: 45,
  loots: [
    {
      itemBlueprintKey: ArmorsBlueprint.Jacket,
      chance: 30,
    },
    {
      itemBlueprintKey: ArmorsBlueprint.Coat,
      chance: 20,
    },
    {
      itemBlueprintKey: MacesBlueprint.SpikedClub,
      chance: 20,
    },
  ],
} as Partial<INPC>;
