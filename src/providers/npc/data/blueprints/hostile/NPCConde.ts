import { INPC } from "@entities/ModuleNPC/NPCModel";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import {
  AccessoriesBlueprint,
  CraftingResourcesBlueprint,
  DaggersBlueprint,
  RangedWeaponsBlueprint,
  ShieldsBlueprint,
  StaffsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { AnimationEffectKeys, MagicPower, NPCAlignment, SpellsBlueprint } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcConde = {
  ...generateMoveTowardsMovement(),
  name: "Conde",
  key: HostileNPCsBlueprint.Conde,
  textureKey: HostileNPCsBlueprint.Conde,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.MeleeRanged,
  ammoKey: AnimationEffectKeys.Dark,
  maxRangeAttack: 8,
  speed: MovementSpeed.Standard,
  canSwitchToRandomTarget: true,
  baseHealth: 2000,
  canSwitchToLowHealthTarget: true,
  skills: {
    level: 70,
    strength: {
      level: 75,
    },
    dexterity: {
      level: 60,
    },
    resistance: {
      level: 30,
    },
    magicResistance: {
      level: 50,
    },
  },
  fleeOnLowHealth: true,
  loots: [
    {
      itemBlueprintKey: StaffsBlueprint.PoisonWand,
      chance: 10,
    },
    {
      itemBlueprintKey: ShieldsBlueprint.PaviseShield,
      chance: 15,
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.Diamond,
      chance: 15,
      quantityRange: [1, 10],
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.Silk,
      chance: 35,
      quantityRange: [1, 10],
    },
    {
      itemBlueprintKey: DaggersBlueprint.HellishDagger,
      chance: 5,
    },
    {
      itemBlueprintKey: AccessoriesBlueprint.HasteRing,
      chance: 1,
    },
    {
      itemBlueprintKey: RangedWeaponsBlueprint.RuneCrossbow,
      chance: 1,
    },
  ],
  entityEffects: [EntityEffectBlueprint.Bleeding],
  areaSpells: [
    {
      spellKey: SpellsBlueprint.VampiricStorm,
      probability: 10,
      power: MagicPower.Medium,
    },
  ],
} as Partial<INPC>;
