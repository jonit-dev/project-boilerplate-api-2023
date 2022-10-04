import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import { EXP_RATIO } from "@providers/constants/SkillConstants";
import {
  AxesBlueprint,
  FoodsBlueprint,
  GlovesBlueprint,
  MacesBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { FriendlyNPCsBlueprint, HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcBandit: Partial<INPC> = {
  ...generateMoveTowardsMovement(),
  name: "Bandit",
  key: HostileNPCsBlueprint.Bandit,
  textureKey: FriendlyNPCsBlueprint.MaleNobleBlackHair,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: MovementSpeed.Standard,
  baseHealth: 50,
  healthRandomizerDice: Dice.D6,
  canSwitchToRandomTarget: true,
  skills: {
    level: 4,
    strength: {
      level: 4,
    },
    dexterity: {
      level: 3,
    },
    resistance: {
      level: 4,
    },
  },
  fleeOnLowHealth: true,
  experience: 50 * EXP_RATIO,
  loots: [
    {
      itemBlueprintKey: MacesBlueprint.SpikedClub,
      chance: 20,
    },
    {
      itemBlueprintKey: GlovesBlueprint.StuddedGloves,
      chance: 20,
    },
    {
      itemBlueprintKey: FoodsBlueprint.Fish,
      chance: 30,
    },
    {
      itemBlueprintKey: AxesBlueprint.Bardiche,
      chance: 5,
    },
  ],
};
