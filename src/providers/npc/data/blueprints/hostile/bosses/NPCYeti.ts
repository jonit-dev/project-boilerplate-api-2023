import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import {
  ArmorsBlueprint,
  AxesBlueprint,
  BootsBlueprint,
  CraftingResourcesBlueprint,
  FoodsBlueprint,
  GlovesBlueprint,
  HammersBlueprint,
  HelmetsBlueprint,
  LegsBlueprint,
  PotionsBlueprint,
  RangedWeaponsBlueprint,
  ShieldsBlueprint,
  SpearsBlueprint,
  StaffsBlueprint,
  SwordsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../../abstractions/BaseNeutralNPC";

export const npcYeti: Partial<INPC> = {
  ...generateMoveTowardsMovement(),
  name: "Yeti",
  key: HostileNPCsBlueprint.Yeti,
  textureKey: HostileNPCsBlueprint.Yeti,
  alignment: NPCAlignment.Hostile,
  speed: MovementSpeed.Fast,
  baseHealth: 800,
  attackType: EntityAttackType.MeleeRanged,
  ammoKey: RangedWeaponsBlueprint.Stone,
  maxRangeAttack: 8,
  healthRandomizerDice: Dice.D20,
  canSwitchToRandomTarget: true,
  canSwitchToLowHealthTarget: true,
  skills: {
    level: 35,
    strength: {
      level: 40,
    },
    dexterity: {
      level: 40,
    },
    resistance: {
      level: 50,
    },
  },
  fleeOnLowHealth: true,
  loots: [
    {
      itemBlueprintKey: BootsBlueprint.CopperBoots,
      chance: 20,
    },
    {
      itemBlueprintKey: SwordsBlueprint.GoldenSword,
      chance: 4,
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
      itemBlueprintKey: FoodsBlueprint.Fish,
      chance: 80,
    },
    {
      itemBlueprintKey: PotionsBlueprint.GreaterLifePotion,
      chance: 50,
    },
    {
      itemBlueprintKey: StaffsBlueprint.MoonsStaff,
      chance: 30,
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
      itemBlueprintKey: AxesBlueprint.Axe,
      chance: 30,
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