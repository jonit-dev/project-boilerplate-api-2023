import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import {
  AccessoriesBlueprint,
  ArmorsBlueprint,
  AxesBlueprint,
  BootsBlueprint,
  CraftingResourcesBlueprint,
  FoodsBlueprint,
  GlovesBlueprint,
  HammersBlueprint,
  HelmetsBlueprint,
  LegsBlueprint,
  RangedWeaponsBlueprint,
  ShieldsBlueprint,
  SpearsBlueprint,
  StaffsBlueprint,
  SwordsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { NPCAlignment, RangeTypes } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../../abstractions/BaseNeutralNPC";

export const npcYeti: Partial<INPC> = {
  ...generateMoveTowardsMovement(),
  name: "Yeti",
  key: HostileNPCsBlueprint.Yeti,
  textureKey: HostileNPCsBlueprint.Yeti,
  alignment: NPCAlignment.Hostile,
  speed: MovementSpeed.Fast,
  baseHealth: 1200,
  attackType: EntityAttackType.MeleeRanged,
  ammoKey: RangedWeaponsBlueprint.Stone,
  maxRangeAttack: RangeTypes.High,
  healthRandomizerDice: Dice.D20,
  canSwitchToRandomTarget: true,
  canSwitchToLowHealthTarget: true,
  skills: {
    level: 100,
    strength: {
      level: 50,
    },
    dexterity: {
      level: 40,
    },
    resistance: {
      level: 90,
    },
    magicResistance: {
      level: 80,
    },
  },
  fleeOnLowHealth: true,
  loots: [
    {
      itemBlueprintKey: BootsBlueprint.CopperBoots,
      chance: 20,
    },

    {
      itemBlueprintKey: ShieldsBlueprint.TowerShield,
      chance: 5,
    },
    {
      itemBlueprintKey: SpearsBlueprint.RoyalSpear,
      chance: 30,
    },
    {
      itemBlueprintKey: StaffsBlueprint.SkyBlueStaff,
      chance: 5,
    },
    {
      itemBlueprintKey: StaffsBlueprint.TartarusStaff,
      chance: 1,
    },

    {
      itemBlueprintKey: FoodsBlueprint.Fish,
      chance: 80,
    },

    {
      itemBlueprintKey: StaffsBlueprint.MoonsStaff,
      chance: 30,
    },
    {
      itemBlueprintKey: AxesBlueprint.RoyalDoubleAxe,
      chance: 10,
    },
    {
      itemBlueprintKey: BootsBlueprint.CopperBoots,
      chance: 20,
    },
    {
      itemBlueprintKey: SpearsBlueprint.RoyalSpear,
      chance: 30,
    },
    {
      itemBlueprintKey: HammersBlueprint.WarHammer,
      chance: 20,
    },
    {
      itemBlueprintKey: SpearsBlueprint.RoyalSpear,
      chance: 30,
    },
    {
      itemBlueprintKey: GlovesBlueprint.PlateGloves,
      chance: 85,
    },
    {
      itemBlueprintKey: LegsBlueprint.StuddedLegs,
      chance: 60,
    },
    {
      itemBlueprintKey: ArmorsBlueprint.BronzeArmor,
      chance: 10,
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
      itemBlueprintKey: HelmetsBlueprint.GlacialCrown,
      chance: 5,
    },
    {
      itemBlueprintKey: AxesBlueprint.GlacialAxe,
      chance: 5,
    },
    {
      itemBlueprintKey: LegsBlueprint.GlacialLegs,
      chance: 5,
    },
    {
      itemBlueprintKey: SwordsBlueprint.GlacialSword,
      chance: 5,
    },
    {
      itemBlueprintKey: AxesBlueprint.Axe,
      chance: 30,
    },
    {
      itemBlueprintKey: AccessoriesBlueprint.GlacialRing,
      chance: 5,
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.Rock,
      chance: 20,
      quantityRange: [5, 10],
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.Jade,
      chance: 10,
      quantityRange: [1, 5],
    },
  ],
  entityEffects: [EntityEffectBlueprint.Bleeding, EntityEffectBlueprint.Freezing],
};
