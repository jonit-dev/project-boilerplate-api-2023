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
  SpearsBlueprint,
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
  baseHealth: 79,
  healthRandomizerDice: Dice.D4,
  skillRandomizerDice: Dice.D4,
  skillsToBeRandomized: ["level", "strength", "dexterity", "resistance"],
  skills: {
    level: 7,
    strength: {
      level: 5,
    },
    dexterity: {
      level: 6,
    },
    resistance: {
      level: 8,
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
      itemBlueprintKey: CraftingResourcesBlueprint.GoldenIngot,
      chance: 10,
      quantityRange: [1, 3],
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.IronIngot,
      chance: 40,
      quantityRange: [5, 10],
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.Obsidian,
      chance: 5,
      quantityRange: [3, 5],
    },
    {
      itemBlueprintKey: SpearsBlueprint.Javelin,
      chance: 5,
      quantityRange: [2, 10],
    },
  ],
} as Partial<INPC>;
