import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import { EXP_RATIO } from "@providers/constants/SkillConstants";
import { FoodsBlueprint, GlovesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcSpider = {
  ...generateMoveTowardsMovement(),
  name: "Spider",
  key: HostileNPCsBlueprint.Spider,
  textureKey: HostileNPCsBlueprint.Spider,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: MovementSpeed.Standard,
  baseHealth: 49,
  healthRandomizerDice: Dice.D4,
  skills: {
    level: 1,
    strength: {
      level: 2,
    },
    dexterity: {
      level: 3,
    },
    resistance: {
      level: 1,
    },
  },
  fleeOnLowHealth: true,
  experience: 5 * EXP_RATIO,
  loots: [
    {
      itemBlueprintKey: GlovesBlueprint.LeatherGloves,
      chance: 10,
    },
    {
      itemBlueprintKey: FoodsBlueprint.Banana,
      chance: 20,
    },
  ],
} as Partial<INPC>;
