import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import {
  ArmorsBlueprint,
  GlovesBlueprint,
  OthersBlueprint,
  StaffsBlueprint,
  SwordsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcFireFox: Partial<INPC> = {
  ...generateMoveTowardsMovement(),
  name: "Fire Fox",
  key: HostileNPCsBlueprint.FireFox,
  textureKey: HostileNPCsBlueprint.FireFox,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: MovementSpeed.ExtraFast,
  baseHealth: 150,
  healthRandomizerDice: Dice.D6,
  canSwitchToRandomTarget: true,
  skills: {
    level: 17,
    strength: {
      level: 20,
    },
    dexterity: {
      level: 25,
    },
    resistance: {
      level: 15,
    },
  },
  fleeOnLowHealth: true,
  loots: [
    {
      itemBlueprintKey: OthersBlueprint.GoldCoin,
      chance: 40,
      quantityRange: [25, 50],
    },
    {
      itemBlueprintKey: SwordsBlueprint.FireSword,
      chance: 20,
    },
    {
      itemBlueprintKey: StaffsBlueprint.FireStaff,
      chance: 10,
    },
    {
      itemBlueprintKey: ArmorsBlueprint.PlateArmor,
      chance: 2,
    },
    {
      itemBlueprintKey: GlovesBlueprint.ChainGloves,
      chance: 10,
    },
  ],
};
