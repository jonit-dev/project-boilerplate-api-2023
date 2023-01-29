import { INPC } from "@entities/ModuleNPC/NPCModel";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import {
  AccessoriesBlueprint,
  BootsBlueprint,
  CraftingResourcesBlueprint,
  GlovesBlueprint,
  MacesBlueprint,
  OthersBlueprint,
  RangedWeaponsBlueprint,
  SpearsBlueprint,
  SwordsBlueprint,
  ToolsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcDwarf = {
  ...generateMoveTowardsMovement(),
  name: "Dwarf",
  key: HostileNPCsBlueprint.Dwarf,
  textureKey: HostileNPCsBlueprint.Dwarf,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: MovementSpeed.Standard,
  canSwitchToRandomTarget: true,
  baseHealth: 76,
  skills: {
    level: 4,
    strength: {
      level: 3,
    },
    dexterity: {
      level: 4,
    },
    resistance: {
      level: 5,
    },
  },
  fleeOnLowHealth: true,
  loots: [
    {
      itemBlueprintKey: BootsBlueprint.Boots,
      chance: 30,
    },
    {
      itemBlueprintKey: ToolsBlueprint.Pickaxe,
      chance: 10,
    },
    {
      itemBlueprintKey: ToolsBlueprint.FishingRod,
      chance: 10,
    },
    {
      itemBlueprintKey: BootsBlueprint.StuddedBoots,
      chance: 15,
    },
    {
      itemBlueprintKey: OthersBlueprint.Candle,
      chance: 10,
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
      quantityRange: [5, 10],
    },
    {
      itemBlueprintKey: RangedWeaponsBlueprint.CorruptionBow,
      chance: 5,
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.IronIngot,
      chance: 40,
      quantityRange: [5, 10],
    },
    {
      itemBlueprintKey: AccessoriesBlueprint.IronRing,
      chance: 10,
    },
    {
      itemBlueprintKey: SpearsBlueprint.StoneSpear,
      chance: 5,
    },
    {
      itemBlueprintKey: SwordsBlueprint.GoldenSword,
      chance: 10,
    },
    {
      itemBlueprintKey: SwordsBlueprint.Sword,
      chance: 5,
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.CorruptionOre,
      chance: 20,
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.GoldenIngot,
      chance: 40,
      quantityRange: [1, 5],
    },
  ],
} as Partial<INPC>;
