import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import {
  AccessoriesBlueprint,
  ArmorsBlueprint,
  BootsBlueprint,
  CraftingResourcesBlueprint,
  RangedWeaponsBlueprint,
  SwordsBlueprint,
  ToolsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcDwarfArcher: Partial<INPC> = {
  ...generateMoveTowardsMovement(),
  name: "Dwarf Archer",
  key: HostileNPCsBlueprint.DwarfArcher,
  textureKey: HostileNPCsBlueprint.DwarfArcher,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.MeleeRanged,
  ammoKey: RangedWeaponsBlueprint.Arrow,
  maxRangeAttack: 10,
  speed: MovementSpeed.Fast,
  baseHealth: 140,
  healthRandomizerDice: Dice.D12,
  canSwitchToRandomTarget: true,
  skills: {
    level: 17,
    strength: {
      level: 14,
    },
    dexterity: {
      level: 8,
    },
    resistance: {
      level: 10,
    },
  },
  fleeOnLowHealth: true,
  loots: [
    {
      itemBlueprintKey: RangedWeaponsBlueprint.Arrow,
      chance: 40,
      quantityRange: [10, 20],
    },
    {
      itemBlueprintKey: RangedWeaponsBlueprint.Bolt,
      chance: 40,
      quantityRange: [10, 20],
    },
    {
      itemBlueprintKey: RangedWeaponsBlueprint.Crossbow,
      chance: 20,
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.Diamond,
      chance: 5,
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
      itemBlueprintKey: ToolsBlueprint.Pickaxe,
      chance: 10,
    },
    {
      itemBlueprintKey: AccessoriesBlueprint.SapphireRing,
      chance: 1,
    },
    {
      itemBlueprintKey: SwordsBlueprint.MithrilSword,
      chance: 5,
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.CorruptionOre,
      chance: 5,
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.SmallWoodenStick,
      chance: 20,
      quantityRange: [1, 5],
    },
    {
      itemBlueprintKey: RangedWeaponsBlueprint.Shuriken,
      chance: 10,
      quantityRange: [5, 10],
    },
  ],
};
