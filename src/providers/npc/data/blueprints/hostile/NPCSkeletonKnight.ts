import { INPC } from "@entities/ModuleNPC/NPCModel";
import {
  ArmorsBlueprint,
  BootsBlueprint,
  ShieldsBlueprint,
  SwordBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/item/data/types/npcsBlueprintTypes";
import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcSkeletonKnight = {
  ...generateMoveTowardsMovement(),
  name: "Skeleton Knight",
  key: HostileNPCsBlueprint.SkeletonKnight,
  textureKey: HostileNPCsBlueprint.SkeletonKnight,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: 5,
  skills: {
    level: 2,
    strength: {
      level: 2,
    },
    dexterity: {
      level: 2,
    },
    resistence: {
      level: 3,
    },
  },
  fleeOnLowHealth: true,
  experience: 12,
  loots: [
    {
      itemBlueprintKey: ArmorsBlueprint.StuddedArmor,
      chance: 25,
    },
    {
      itemBlueprintKey: ShieldsBlueprint.StuddedShield,
      chance: 30,
    },
    {
      itemBlueprintKey: SwordBlueprint.DoubleEdgedSword,
      chance: 5,
    },
    {
      itemBlueprintKey: SwordBlueprint.DragonsSword,
      chance: 1,
    },
    {
      itemBlueprintKey: BootsBlueprint.StuddedBoots,
      chance: 25,
    },
  ],
} as Partial<INPC>;
