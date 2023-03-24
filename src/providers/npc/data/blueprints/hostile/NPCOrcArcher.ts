import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import {
  ArmorsBlueprint,
  BootsBlueprint,
  CraftingResourcesBlueprint,
  DaggersBlueprint,
  HelmetsBlueprint,
  LegsBlueprint,
  RangedWeaponsBlueprint,
  StaffsBlueprint,
  ToolsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcOrcArcher: Partial<INPC> = {
  ...generateMoveTowardsMovement(),
  name: "Orc Archer",
  key: HostileNPCsBlueprint.OrcArcher,
  textureKey: HostileNPCsBlueprint.OrcArcher,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.MeleeRanged,
  ammoKey: RangedWeaponsBlueprint.Arrow,
  maxRangeAttack: 6,
  speed: MovementSpeed.Fast,
  baseHealth: 100,
  healthRandomizerDice: Dice.D12,
  canSwitchToRandomTarget: true,
  skillRandomizerDice: Dice.D12,
  skills: {
    level: 15,
    strength: {
      level: 7,
    },
    dexterity: {
      level: 7,
    },
    resistance: {
      level: 3,
    },
    magicResistance: {
      level: 3,
    },
    distance: {
      level: 7,
    },
  },
  fleeOnLowHealth: true,
  loots: [
    {
      itemBlueprintKey: HelmetsBlueprint.LeatherHelmet,
      chance: 30,
    },

    {
      itemBlueprintKey: ToolsBlueprint.FishingRod,
      chance: 10,
    },
    {
      itemBlueprintKey: LegsBlueprint.StuddedLegs,
      chance: 15,
    },
    {
      itemBlueprintKey: DaggersBlueprint.NinjaKunai,
      chance: 15,
    },

    {
      itemBlueprintKey: RangedWeaponsBlueprint.IronArrow,
      chance: 20,
      quantityRange: [3, 10],
    },
    {
      itemBlueprintKey: StaffsBlueprint.EnchantedStaff,
      chance: 5,
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.ElvenWood,
      chance: 30,
      quantityRange: [10, 15],
    },
    {
      itemBlueprintKey: BootsBlueprint.IronBoots,
      chance: 10,
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.BlueSapphire,
      chance: 30,
      quantityRange: [1, 3],
    },
    {
      itemBlueprintKey: LegsBlueprint.BronzeLegs,
      chance: 2,
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.RedSapphire,
      chance: 30,
      quantityRange: [1, 3],
    },
    {
      itemBlueprintKey: ArmorsBlueprint.BronzeArmor,
      chance: 10,
    },
    {
      itemBlueprintKey: RangedWeaponsBlueprint.OrcishBow,
      chance: 40,
    },
  ],
};
