import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import { GlovesBlueprint, PotionsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { NPCAlignment, NPCSubtype } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcSlime = {
  ...generateMoveTowardsMovement(),
  name: "Slime",
  key: HostileNPCsBlueprint.Slime,
  subType: NPCSubtype.Elemental,
  textureKey: HostileNPCsBlueprint.Slime,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: MovementSpeed.ExtraSlow,
  baseHealth: 118,
  healthRandomizerDice: Dice.D4,
  skillRandomizerDice: Dice.D4,
  skillsToBeRandomized: ["level", "strength", "dexterity", "resistance"],
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
  loots: [
    {
      itemBlueprintKey: GlovesBlueprint.LeatherGloves,
      chance: 10,
    },
    {
      itemBlueprintKey: PotionsBlueprint.LightLifePotion,
      chance: 20,
    },
  ],
} as Partial<INPC>;
