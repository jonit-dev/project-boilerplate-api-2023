import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import {
  ArmorsBlueprint,
  BootsBlueprint,
  CraftingResourcesBlueprint,
  GlovesBlueprint,
  MacesBlueprint,
  RangedWeaponsBlueprint,
  ShieldsBlueprint,
  SpearsBlueprint,
  SwordsBlueprint,
  ToolsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcDwarfGuard = {
  ...generateMoveTowardsMovement(),
  name: "Dwarf Guard",
  key: HostileNPCsBlueprint.DwarfGuard,
  textureKey: HostileNPCsBlueprint.DwarfGuard,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: MovementSpeed.Fast,
  canSwitchToLowHealthTarget: true,
  baseHealth: 180,
  healthRandomizerDice: Dice.D4,
  skillRandomizerDice: Dice.D4,
  skillsToBeRandomized: ["level", "strength", "dexterity", "resistance"],
  skills: {
    level: 22,
    strength: {
      level: 14,
    },
    dexterity: {
      level: 12,
    },
    resistance: {
      level: 16,
    },
  },
  fleeOnLowHealth: true,
  loots: [
    {
      itemBlueprintKey: BootsBlueprint.Boots,
      chance: 30,
    },

    {
      itemBlueprintKey: ToolsBlueprint.FishingRod,
      chance: 20,
    },
    {
      itemBlueprintKey: ToolsBlueprint.Pickaxe,
      chance: 10,
    },

    {
      itemBlueprintKey: BootsBlueprint.StuddedBoots,
      chance: 15,
    },
    {
      itemBlueprintKey: SwordsBlueprint.AzureMachete,
      chance: 15,
    },
    {
      itemBlueprintKey: ArmorsBlueprint.IronArmor,
      chance: 20,
    },
    {
      itemBlueprintKey: GlovesBlueprint.StuddedGloves,
      chance: 15,
    },
    {
      itemBlueprintKey: MacesBlueprint.SpikedClub,
      chance: 10,
    },
    {
      itemBlueprintKey: RangedWeaponsBlueprint.Arrow,
      chance: 20,
      quantityRange: [7, 12],
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.Diamond,
      chance: 1,
    },

    {
      itemBlueprintKey: CraftingResourcesBlueprint.ObsidiumOre,
      chance: 5,
    },
    {
      itemBlueprintKey: SpearsBlueprint.Javelin,
      chance: 5,
    },
    {
      itemBlueprintKey: ShieldsBlueprint.DwarvenShield,
      chance: 20,
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.CorruptionOre,
      chance: 5,
    },
  ],
} as Partial<INPC>;
