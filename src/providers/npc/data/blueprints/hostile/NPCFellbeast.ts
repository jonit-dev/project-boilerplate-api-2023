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
import { AnimationEffectKeys, MagicPower, NPCAlignment, NPCSubtype, SpellsBlueprint } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcFellbeast = {
  ...generateMoveTowardsMovement(),
  name: "FellBeast",
  key: HostileNPCsBlueprint.Fellbeast,
  subType: NPCSubtype.Animal,
  textureKey: HostileNPCsBlueprint.Fellbeast,
  alignment: NPCAlignment.Hostile,
  speed: MovementSpeed.ExtraFast,
  baseHealth: 2500,
  healthRandomizerDice: Dice.D6,
  attackType: EntityAttackType.MeleeRanged,
  ammoKey: AnimationEffectKeys.Green,
  maxRangeAttack: 6,
  canSwitchToLowHealthTarget: true,
  canSwitchToRandomTarget: true,
  skills: {
    level: 75,
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
      itemBlueprintKey: CraftingResourcesBlueprint.Silk,
      chance: 35,
      quantityRange: [1, 6],
    },
    {
      itemBlueprintKey: HelmetsBlueprint.BerserkersHelmet,
      chance: 10,
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
      itemBlueprintKey: DaggersBlueprint.CorruptionDagger,
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
  entityEffects: [EntityEffectBlueprint.Poison, EntityEffectBlueprint.Poison],
  areaSpells: [
    {
      spellKey: SpellsBlueprint.NaturesRevenge,
      probability: 10,
      power: MagicPower.Low,
    },
  ],
} as Partial<INPC>;
