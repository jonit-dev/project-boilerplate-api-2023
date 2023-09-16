import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import {
  AccessoriesBlueprint,
  ArmorsBlueprint,
  CraftingResourcesBlueprint,
  DaggersBlueprint,
  HelmetsBlueprint,
  SpearsBlueprint,
  SwordsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { MagicPower, NPCAlignment, NPCSubtype, SpellsBlueprint } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcNightFellbeast = {
  ...generateMoveTowardsMovement(),
  name: "Night Fellbeast",
  key: HostileNPCsBlueprint.NightFellbeast,
  subType: NPCSubtype.Animal,
  textureKey: HostileNPCsBlueprint.NightFellbeast,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: MovementSpeed.ExtraFast,
  baseHealth: 3000,
  healthRandomizerDice: Dice.D6,
  canSwitchToRandomTarget: true,
  skills: {
    level: 99,
    strength: {
      level: 80,
    },
    dexterity: {
      level: 60,
    },
    resistance: {
      level: 60,
    },
  },
  fleeOnLowHealth: true,
  loots: [
    {
      itemBlueprintKey: CraftingResourcesBlueprint.Diamond,
      chance: 25,
      quantityRange: [1, 2],
    },
    {
      itemBlueprintKey: DaggersBlueprint.PhoenixDagger,
      chance: 5,
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
      itemBlueprintKey: DaggersBlueprint.CorruptionDagger,
      chance: 5,
    },
    {
      itemBlueprintKey: AccessoriesBlueprint.RubyRing,
      chance: 2,
    },
    {
      itemBlueprintKey: SpearsBlueprint.Corseque,
      chance: 10,
    },
    {
      itemBlueprintKey: SwordsBlueprint.EnchantedSword,
      chance: 15,
    },
    {
      itemBlueprintKey: ArmorsBlueprint.GoldenArmor,
      chance: 5,
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.Skull,
      chance: 50,
      quantityRange: [1, 10],
    },

    {
      itemBlueprintKey: ArmorsBlueprint.MithrilArmor,
      chance: 5,
    },
  ],
  entityEffects: [EntityEffectBlueprint.Bleeding, EntityEffectBlueprint.Corruption],
  areaSpells: [
    {
      spellKey: SpellsBlueprint.CorruptionWave,
      probability: 5,
      power: MagicPower.High,
    },
  ],
} as Partial<INPC>;
