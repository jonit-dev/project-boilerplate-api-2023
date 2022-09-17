import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import { EXP_RATIO } from "@providers/constants/SkillConstants";

import { HostileNPCsBlueprint } from "@providers/item/data/types/npcsBlueprintTypes";
import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

import {
  FoodsBlueprint,
  GlovesBlueprint,
  MacesBlueprint,
  PotionsBlueprint,
  RangedBlueprint,
  SpearsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";

export const npcCaveTroll = {
  ...generateMoveTowardsMovement(),
  name: "Cave Troll",
  key: HostileNPCsBlueprint.CaveTroll,
  textureKey: HostileNPCsBlueprint.CaveTroll,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: MovementSpeed.Slow,
  baseHealth: 240,
  healthRandomizerDice: Dice.D20,
  canSwitchToRandomTarget: true,
  skills: {
    level: 18,
    strength: {
      level: 17,
    },
    dexterity: {
      level: 5,
    },
  },
  fleeOnLowHealth: true,
  experience: 180 * EXP_RATIO,
  loots: [
    {
      itemBlueprintKey: MacesBlueprint.SpikedClub,
      chance: 25,
    },
    {
      itemBlueprintKey: GlovesBlueprint.ChainGloves,
      chance: 10,
    },
    {
      itemBlueprintKey: PotionsBlueprint.LightEndurancePotion,
      chance: 30,
    },
    {
      itemBlueprintKey: RangedBlueprint.Arrow,
      chance: 50,
      quantityRange: [5, 10],
    },
    {
      itemBlueprintKey: SpearsBlueprint.Spear,
      chance: 20,
    },
    {
      itemBlueprintKey: FoodsBlueprint.Salmon,
      chance: 30,
    },
  ],
} as Partial<INPC>;
