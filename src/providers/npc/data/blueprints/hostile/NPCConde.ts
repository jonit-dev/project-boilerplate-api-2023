import { INPC } from "@entities/ModuleNPC/NPCModel";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import {
  HelmetsBlueprint,
  LegsBlueprint,
  RangedWeaponsBlueprint,
  ShieldsBlueprint,
  StaffsBlueprint,
  SwordsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcConde = {
  ...generateMoveTowardsMovement(),
  name: "Conde",
  key: HostileNPCsBlueprint.Conde,
  textureKey: HostileNPCsBlueprint.Conde,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: MovementSpeed.Standard,
  canSwitchToRandomTarget: true,
  baseHealth: 150,
  skills: {
    level: 15,
    strength: {
      level: 10,
    },
    dexterity: {
      level: 8,
    },
    resistance: {
      level: 8,
    },
  },
  fleeOnLowHealth: true,
  loots: [
    {
      itemBlueprintKey: StaffsBlueprint.PoisonWand,
      chance: 10,
    },
    {
      itemBlueprintKey: ShieldsBlueprint.PaviseShield,
      chance: 15,
    },
    {
      itemBlueprintKey: HelmetsBlueprint.IronHelmet,
      chance: 10,
    },
    {
      itemBlueprintKey: RangedWeaponsBlueprint.HorseBow,
      chance: 15,
    },
    {
      itemBlueprintKey: SwordsBlueprint.GoldenSword,
      chance: 10,
    },
    {
      itemBlueprintKey: LegsBlueprint.GlacialLegs,
      chance: 15,
    },
  ],
} as Partial<INPC>;
