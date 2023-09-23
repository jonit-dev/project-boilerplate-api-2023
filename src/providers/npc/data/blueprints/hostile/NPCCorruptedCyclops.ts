import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";

import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import {
  BootsBlueprint,
  DaggersBlueprint,
  HelmetsBlueprint,
  LegsBlueprint,
  SwordsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { AnimationEffectKeys, MagicPower, NPCAlignment, SpellsBlueprint } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcCorruptedCyclops = {
  ...generateMoveTowardsMovement(),
  name: "Corrupted Cyclops",
  key: HostileNPCsBlueprint.CorruptedCyclops,
  textureKey: HostileNPCsBlueprint.CorruptedCyclops,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.MeleeRanged,
  ammoKey: AnimationEffectKeys.Dark,
  maxRangeAttack: 6,
  speed: MovementSpeed.Slow,
  baseHealth: 1500,
  healthRandomizerDice: Dice.D20,
  canSwitchToRandomTarget: true,
  skillRandomizerDice: Dice.D20,
  skillsToBeRandomized: ["level", "strength", "dexterity", "resistance"],
  skills: {
    level: 100,
    strength: {
      level: 80,
    },
    dexterity: {
      level: 60,
    },
    resistance: {
      level: 100,
    },
  },
  fleeOnLowHealth: true,
  loots: [
    {
      itemBlueprintKey: DaggersBlueprint.RomanDagger,
      chance: 25,
    },
    {
      itemBlueprintKey: HelmetsBlueprint.VikingHelmet,
      chance: 15,
    },
    {
      itemBlueprintKey: BootsBlueprint.SilverBoots,
      chance: 15,
    },
    {
      itemBlueprintKey: SwordsBlueprint.GlacialSword,
      chance: 15,
    },
    {
      itemBlueprintKey: DaggersBlueprint.RustedDagger,
      chance: 15,
    },
    {
      itemBlueprintKey: BootsBlueprint.GoldenBoots,
      chance: 2,
    },
    {
      itemBlueprintKey: HelmetsBlueprint.RoyalHelmet,
      chance: 10,
    },
    {
      itemBlueprintKey: LegsBlueprint.PridelandsLegs,
      chance: 5,
    },
  ],
  entityEffects: [EntityEffectBlueprint.Bleeding, EntityEffectBlueprint.Corruption],
  areaSpells: [
    {
      spellKey: SpellsBlueprint.CorruptionWave,
      probability: 5,
      power: MagicPower.Medium,
    },
  ],
} as Partial<INPC>;
