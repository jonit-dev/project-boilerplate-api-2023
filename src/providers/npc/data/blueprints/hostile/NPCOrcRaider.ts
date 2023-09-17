import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import {
  AccessoriesBlueprint,
  ArmorsBlueprint,
  BootsBlueprint,
  ContainersBlueprint,
  CraftingResourcesBlueprint,
  DaggersBlueprint,
  GlovesBlueprint,
  HammersBlueprint,
  HelmetsBlueprint,
  RangedWeaponsBlueprint,
  StaffsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcOrcRaider = {
  ...generateMoveTowardsMovement(),
  name: "Orc Raider",
  key: HostileNPCsBlueprint.OrcRaider,
  textureKey: HostileNPCsBlueprint.OrcRaider,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.MeleeRanged,
  ammoKey: RangedWeaponsBlueprint.Arrow,
  speed: MovementSpeed.ExtraFast,
  maxRangeAttack: 6,
  baseHealth: 600,
  healthRandomizerDice: Dice.D6,
  skillRandomizerDice: Dice.D4,
  skillsToBeRandomized: ["level", "strength", "dexterity"],
  canSwitchToRandomTarget: true,
  canSwitchToLowHealthTarget: true,
  skills: {
    level: 55,
    strength: {
      level: 45,
    },
    dexterity: {
      level: 50,
    },
    resistance: {
      level: 40,
    },
  },
  loots: [
    {
      itemBlueprintKey: CraftingResourcesBlueprint.GreenOre,
      chance: 10,
      quantityRange: [1, 3],
    },
    {
      itemBlueprintKey: AccessoriesBlueprint.OrcRing,
      chance: 20,
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.RedSapphire,
      chance: 20,
      quantityRange: [1, 3],
    },
    {
      itemBlueprintKey: DaggersBlueprint.AzureDagger,
      chance: 20,
    },
    {
      itemBlueprintKey: HammersBlueprint.WarHammer,
      chance: 10,
    },
    {
      itemBlueprintKey: HelmetsBlueprint.InfantryHelmet,
      chance: 10,
    },
    {
      itemBlueprintKey: StaffsBlueprint.AirWand,
      chance: 10,
    },

    {
      itemBlueprintKey: DaggersBlueprint.RomanDagger,
      chance: 7,
    },
    {
      itemBlueprintKey: ContainersBlueprint.Backpack,
      chance: 10,
    },

    {
      itemBlueprintKey: BootsBlueprint.CopperBoots,
      chance: 20,
    },
    {
      itemBlueprintKey: GlovesBlueprint.PlateGloves,
      chance: 10,
    },
    {
      itemBlueprintKey: ArmorsBlueprint.PlateArmor,
      chance: 5,
    },
  ],
  entityEffects: [EntityEffectBlueprint.Bleeding],
} as Partial<INPC>;
