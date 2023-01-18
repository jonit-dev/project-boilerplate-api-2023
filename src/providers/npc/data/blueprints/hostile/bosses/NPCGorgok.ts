import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import {
  ArmorsBlueprint,
  BootsBlueprint,
  LegsBlueprint,
  RangedWeaponsBlueprint,
  SwordsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { generateMoveTowardsMovement } from "@providers/npc/data/abstractions/BaseNeutralNPC";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";

export const npcGorgok = {
  ...generateMoveTowardsMovement(),
  name: "Gorgok, the Chief",
  key: HostileNPCsBlueprint.Gorgok,
  textureKey: HostileNPCsBlueprint.Goblin,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.MeleeRanged,
  ammoKey: RangedWeaponsBlueprint.IronArrow,
  maxRangeAttack: 8,
  speed: MovementSpeed.Fast,
  baseHealth: 1000,
  healthRandomizerDice: Dice.D12,
  canSwitchToRandomTarget: true,
  canSwitchToLowHealthTarget: true,
  skills: {
    level: 80,
    strength: {
      level: 40,
    },
    dexterity: {
      level: 50,
    },
    resistance: {
      level: 30,
    },
  },
  fleeOnLowHealth: true,
  loots: [
    {
      itemBlueprintKey: SwordsBlueprint.DragonsSword,
      chance: 40,
    },
    {
      itemBlueprintKey: ArmorsBlueprint.GoldenArmor,
      chance: 20,
    },
    {
      itemBlueprintKey: BootsBlueprint.GoldenBoots,
      chance: 30,
    },
    {
      itemBlueprintKey: RangedWeaponsBlueprint.IronArrow,
      chance: 25,
      quantityRange: [10, 20],
    },
    {
      itemBlueprintKey: LegsBlueprint.StuddedLegs,
      chance: 60,
    },
  ],
} as Partial<INPC>;
