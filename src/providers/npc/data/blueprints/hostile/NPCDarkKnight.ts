import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import { RangedWeaponRange } from "@providers/item/data/types/RangedWeaponTypes";
import {
  AccessoriesBlueprint,
  ArmorsBlueprint,
  BootsBlueprint,
  CraftingResourcesBlueprint,
  FoodsBlueprint,
  HelmetsBlueprint,
  LegsBlueprint,
  OthersBlueprint,
  RangedWeaponsBlueprint,
  ShieldsBlueprint,
  SwordsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcDarkKnight: Partial<INPC> = {
  ...generateMoveTowardsMovement(),
  name: "Dark Knight",
  key: HostileNPCsBlueprint.DarkKnight,
  textureKey: "superior-knight",
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.MeleeRanged,
  speed: MovementSpeed.ExtraFast,
  ammoKey: RangedWeaponsBlueprint.Bolt,
  maxRangeAttack: RangedWeaponRange.High,
  baseHealth: 1200,
  healthRandomizerDice: Dice.D20,
  canSwitchToRandomTarget: true,
  canSwitchToLowHealthTarget: true,
  skills: {
    level: 85,
    strength: {
      level: 100,
    },
    dexterity: {
      level: 60,
    },
    resistance: {
      level: 100,
    },
    magicResistance: {
      level: 100,
    },
  },
  loots: [
    {
      itemBlueprintKey: FoodsBlueprint.Cookie,
      chance: 75,
      quantityRange: [1, 10],
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.IronOre,
      chance: 60,
      quantityRange: [2, 6],
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.Diamond,
      chance: 25,
      quantityRange: [1, 2],
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.Silk,
      chance: 35,
      quantityRange: [1, 6],
    },
    {
      itemBlueprintKey: HelmetsBlueprint.BerserkersHelmet,
      chance: 10,
    },
    {
      itemBlueprintKey: OthersBlueprint.GoldCoin,
      chance: 50,
      quantityRange: [25, 75],
    },

    {
      itemBlueprintKey: CraftingResourcesBlueprint.Skull,
      chance: 50,
      quantityRange: [1, 10],
    },

    {
      itemBlueprintKey: ArmorsBlueprint.GoldenArmor,
      chance: 0.5,
    },

    {
      itemBlueprintKey: LegsBlueprint.GoldenLegs,
      chance: 2,
    },
    {
      itemBlueprintKey: BootsBlueprint.GoldenBoots,
      chance: 2,
    },
    {
      itemBlueprintKey: HelmetsBlueprint.RoyalHelmet,
      chance: 30,
    },

    {
      itemBlueprintKey: HelmetsBlueprint.SaviorsHelmet,
      chance: 5,
    },
    {
      itemBlueprintKey: SwordsBlueprint.CorruptionSword,
      chance: 5,
    },
    {
      itemBlueprintKey: HelmetsBlueprint.RoyalKnightHelmet,
      chance: 5,
    },
    {
      itemBlueprintKey: ShieldsBlueprint.SilverShield,
      chance: 30,
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.PhoenixFeather,
      chance: 50,
      quantityRange: [1, 3],
    },
    {
      itemBlueprintKey: ArmorsBlueprint.KnightArmor,
      chance: 20,
    },
    {
      itemBlueprintKey: HelmetsBlueprint.CrownHelmet,
      chance: 5,
    },
    {
      itemBlueprintKey: ArmorsBlueprint.CrownArmor,
      chance: 5,
    },
    {
      itemBlueprintKey: LegsBlueprint.BloodfireLegs,
      chance: 5,
    },
    {
      itemBlueprintKey: AccessoriesBlueprint.FalconsRing,
      chance: 5,
    },
    {
      itemBlueprintKey: ShieldsBlueprint.CrimsonAegisShield,
      chance: 0.5,
    },
    {
      itemBlueprintKey: ShieldsBlueprint.FalconsShield,
      chance: 5,
    },
    {
      itemBlueprintKey: SwordsBlueprint.FalconsSword,
      chance: 5,
    },
  ],
  entityEffects: [EntityEffectBlueprint.Bleeding, EntityEffectBlueprint.Freezing],
};
