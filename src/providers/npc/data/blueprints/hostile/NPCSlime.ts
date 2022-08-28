import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import { EXP_RATIO } from "@providers/constants/SkillConstants";
import { GlovesBlueprint, HelmetBlueprint, PotionsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/item/data/types/npcsBlueprintTypes";
import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcSlime = {
  ...generateMoveTowardsMovement(),
  name: "Slime",
  key: HostileNPCsBlueprint.Slime,
  textureKey: HostileNPCsBlueprint.Slime,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: MovementSpeed.ExtraSlow,
  baseHealth: 118,
  healthRandomizerDice: Dice.D4,
  skills: {
    level: 4,
    strength: {
      level: 4,
    },
    dexterity: {
      level: 3,
    },
    resistance: {
      level: 5,
    },
  },
  fleeOnLowHealth: true,
  experience: 13 * EXP_RATIO,
  loots: [
    {
      itemBlueprintKey: GlovesBlueprint.LeatherGloves,
      chance: 10,
    },
    {
      itemBlueprintKey: PotionsBlueprint.LightLifePotion,
      chance: 20,
    },
    {
      itemBlueprintKey: HelmetBlueprint.WingHelmet,
      chance: 5,
    },
  ],
} as Partial<INPC>;
