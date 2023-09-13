import { INPC } from "@entities/ModuleNPC/NPCModel";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import {
  AccessoriesBlueprint,
  AxesBlueprint,
  BootsBlueprint,
  GlovesBlueprint,
  RangedWeaponsBlueprint,
  SwordsBlueprint,
  ToolsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcCondessa = {
  ...generateMoveTowardsMovement(),
  name: "Condessa",
  key: HostileNPCsBlueprint.Condessa,
  textureKey: HostileNPCsBlueprint.Condessa,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: MovementSpeed.Standard,
  canSwitchToRandomTarget: true,
  baseHealth: 180,
  skills: {
    level: 20,
    strength: {
      level: 15,
    },
    dexterity: {
      level: 10,
    },
    resistance: {
      level: 10,
    },
  },
  fleeOnLowHealth: true,
  loots: [
    {
      itemBlueprintKey: BootsBlueprint.SilverBoots,
      chance: 30,
    },
    {
      itemBlueprintKey: ToolsBlueprint.ButchersKnife,
      chance: 10,
    },
    {
      itemBlueprintKey: SwordsBlueprint.CopperBroadsword,
      chance: 10,
    },
    {
      itemBlueprintKey: AxesBlueprint.CorruptionAxe,
      chance: 15,
    },
    {
      itemBlueprintKey: AccessoriesBlueprint.DeathNecklace,
      chance: 10,
    },
    {
      itemBlueprintKey: GlovesBlueprint.StuddedGloves,
      chance: 15,
    },
    {
      itemBlueprintKey: RangedWeaponsBlueprint.EldensBow,
      chance: 10,
    },
  ],
} as Partial<INPC>;
