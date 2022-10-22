import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import { EXP_RATIO } from "@providers/constants/SkillConstants";
import {
  FoodsBlueprint,
  OthersBlueprint,
  PotionsBlueprint,
  SwordsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcBlackSpider: Partial<INPC> = {
  ...generateMoveTowardsMovement(),
  name: "Black Spider",
  key: HostileNPCsBlueprint.BlackSpider,
  textureKey: HostileNPCsBlueprint.BlackSpider,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: MovementSpeed.Fast,
  baseHealth: 45,
  healthRandomizerDice: Dice.D6,
  skills: {
    level: 5,
    strength: {
      level: 3,
    },
    dexterity: {
      level: 3,
    },
    resistance: {
      level: 5,
    },
  },
  fleeOnLowHealth: true,
  experience: 12 * EXP_RATIO,
  loots: [
    {
      itemBlueprintKey: OthersBlueprint.GoldCoin,
      chance: 30,
      quantityRange: [3, 10],
    },
    {
      itemBlueprintKey: PotionsBlueprint.ManaPotion,
      chance: 20,
    },
    {
      itemBlueprintKey: FoodsBlueprint.Fish,
      chance: 30,
    },
    {
      itemBlueprintKey: SwordsBlueprint.ShortSword,
      chance: 20,
    },
  ],
};
