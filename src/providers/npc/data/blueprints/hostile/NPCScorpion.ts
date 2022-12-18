import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import { FoodsBlueprint, OthersBlueprint, PotionsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { NPCAlignment, NPCSubtype } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcScorpion: Partial<INPC> = {
  ...generateMoveTowardsMovement(),
  name: "Scorpion",
  key: HostileNPCsBlueprint.Scorpion,
  subType: NPCSubtype.Insect,
  textureKey: HostileNPCsBlueprint.Scorpion,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: MovementSpeed.Standard,
  baseHealth: 40,
  healthRandomizerDice: Dice.D6,
  canSwitchToRandomTarget: true,
  skills: {
    level: 3,
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
      itemBlueprintKey: OthersBlueprint.GoldCoin,
      chance: 30,
      quantityRange: [3, 10],
    },
    {
      itemBlueprintKey: PotionsBlueprint.LightAntidote,
      chance: 10,
    },
    {
      itemBlueprintKey: FoodsBlueprint.Potato,
      chance: 20,
    },
  ],
  entityEffects: [EntityEffectBlueprint.Poison],
};
