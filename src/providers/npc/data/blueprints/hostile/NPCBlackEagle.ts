import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import {
  FoodsBlueprint,
  PotionsBlueprint,
  RangedWeaponsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcBlackEagle = {
  ...generateMoveTowardsMovement(),
  name: "Black Eagle",
  key: HostileNPCsBlueprint.BlackEagle,
  textureKey: HostileNPCsBlueprint.BlackEagle,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: MovementSpeed.ExtraFast,
  baseHealth: 55,
  healthRandomizerDice: Dice.D12,
  canSwitchToRandomTarget: true,
  canSwitchToLowHealthTarget: true,
  skills: {
    level: 4,
    strength: {
      level: 3,
    },
    dexterity: {
      level: 8,
    },
    resistance: {
      level: 3,
    },
  },
  fleeOnLowHealth: true,
  loots: [
    {
      itemBlueprintKey: PotionsBlueprint.GreaterLifePotion,
      chance: 30,
    },
    {
      itemBlueprintKey: FoodsBlueprint.Fish,
      chance: 50,
    },
    {
      itemBlueprintKey: RangedWeaponsBlueprint.Stone,
      chance: 30,
      quantityRange: [5, 15],
    },
  ],
} as Partial<INPC>;
