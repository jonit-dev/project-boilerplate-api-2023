import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import { EXP_RATIO } from "@providers/constants/SkillConstants";
import {
  AccessoriesBlueprint,
  AxesBlueprint,
  BootsBlueprint,
  FoodsBlueprint,
  HelmetBlueprint,
  PotionsBlueprint,
  RangedBlueprint,
  ShieldsBlueprint,
  SwordBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/item/data/types/npcsBlueprintTypes";
import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcGoblin = {
  ...generateMoveTowardsMovement(),
  name: "Goblin",
  key: HostileNPCsBlueprint.Goblin,
  textureKey: HostileNPCsBlueprint.Goblin,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: MovementSpeed.Fast,
  baseHealth: 45,
  healthRandomizerDice: Dice.D12,
  canSwitchToRandomTarget: true,
  canSwitchToLowHealthTarget: true,
  skills: {
    level: 5,
    strength: {
      level: 5,
    },
    dexterity: {
      level: 8,
    },
  },
  fleeOnLowHealth: true,
  experience: 40 * EXP_RATIO,
  loots: [
    {
      itemBlueprintKey: SwordBlueprint.ShortSword,
      chance: 20,
    },
    {
      itemBlueprintKey: FoodsBlueprint.Fish,
      chance: 10,
    },

    {
      itemBlueprintKey: HelmetBlueprint.BrassHelmet,
      chance: 10,
    },
    {
      itemBlueprintKey: ShieldsBlueprint.WoodenShield,
      chance: 10,
    },
    {
      itemBlueprintKey: AxesBlueprint.Bardiche,
      chance: 5,
    },
    {
      itemBlueprintKey: BootsBlueprint.Sandals,
      chance: 20,
    },
    {
      itemBlueprintKey: PotionsBlueprint.LightLifePotion,
      chance: 10,
    },
    {
      itemBlueprintKey: RangedBlueprint.Stone,
      chance: 30,
      quantityRange: [5, 15],
    },
    {
      itemBlueprintKey: AccessoriesBlueprint.Rope,
      chance: 30,
    },
  ],
} as Partial<INPC>;
