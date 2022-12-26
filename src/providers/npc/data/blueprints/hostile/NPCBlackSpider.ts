import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import {
  FoodsBlueprint,
  HelmetsBlueprint,
  PotionsBlueprint,
  SwordsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { NPCAlignment, NPCSubtype } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcBlackSpider: Partial<INPC> = {
  ...generateMoveTowardsMovement(),
  name: "Black Spider",
  key: HostileNPCsBlueprint.BlackSpider,
  subType: NPCSubtype.Insect,
  textureKey: HostileNPCsBlueprint.BlackSpider,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: MovementSpeed.Standard,
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
      level: 2,
    },
  },
  fleeOnLowHealth: true,
  loots: [
    {
      itemBlueprintKey: PotionsBlueprint.ManaPotion,
      chance: 20,
    },
    {
      itemBlueprintKey: HelmetsBlueprint.WizardHat,
      chance: 10,
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
