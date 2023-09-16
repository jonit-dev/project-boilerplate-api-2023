import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";

import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import {
  AxesBlueprint,
  DaggersBlueprint,
  RangedWeaponsBlueprint,
  SpearsBlueprint,
  SwordsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { MagicPower, NPCAlignment, SpellsBlueprint } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcIceCyclops = {
  ...generateMoveTowardsMovement(),
  name: "Ice Cyclops",
  key: HostileNPCsBlueprint.IceCyclops,
  textureKey: HostileNPCsBlueprint.IceCyclops,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: MovementSpeed.Slow,
  baseHealth: 800,
  healthRandomizerDice: Dice.D20,
  canSwitchToRandomTarget: true,
  skillRandomizerDice: Dice.D20,
  skillsToBeRandomized: ["level", "strength", "dexterity", "resistance"],
  skills: {
    level: 75,
    strength: {
      level: 45,
    },
    dexterity: {
      level: 45,
    },
    resistance: {
      level: 90,
    },
  },
  fleeOnLowHealth: true,
  loots: [
    {
      itemBlueprintKey: DaggersBlueprint.FrostDagger,
      chance: 25,
    },
    {
      itemBlueprintKey: SpearsBlueprint.PoseidonTrident,
      chance: 15,
    },

    {
      itemBlueprintKey: SwordsBlueprint.LightingSword,
      chance: 15,
    },
    {
      itemBlueprintKey: AxesBlueprint.GlacialAxe,
      chance: 10,
    },
    {
      itemBlueprintKey: RangedWeaponsBlueprint.FrostArrow,
      chance: 50,
      quantityRange: [5, 10],
    },
  ],
  entityEffects: [EntityEffectBlueprint.Bleeding, EntityEffectBlueprint.Freezing],
  areaSpells: [
    {
      spellKey: SpellsBlueprint.Blizzard,
      probability: 10,
      power: MagicPower.High,
    },
  ],
} as Partial<INPC>;
