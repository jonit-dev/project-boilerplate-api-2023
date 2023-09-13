import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import {
  AccessoriesBlueprint,
  BootsBlueprint,
  FoodsBlueprint,
  ShieldsBlueprint,
  SpearsBlueprint,
  StaffsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { NPCAlignment, NPCSubtype } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcGolem: Partial<INPC> = {
  ...generateMoveTowardsMovement(),
  name: "Golem",
  key: HostileNPCsBlueprint.Golem,
  subType: NPCSubtype.Elemental,
  textureKey: HostileNPCsBlueprint.Golem,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: MovementSpeed.ExtraSlow,
  baseHealth: 2000,
  healthRandomizerDice: Dice.D6,
  canSwitchToRandomTarget: true,
  skillRandomizerDice: Dice.D4,
  skillsToBeRandomized: ["level", "strength", "dexterity", "resistance"],
  skills: {
    level: 50,
    strength: {
      level: 45,
    },
    dexterity: {
      level: 15,
    },
    resistance: {
      level: 130,
    },
    magicResistance: {
      level: 45,
    },
  },
  fleeOnLowHealth: true,
  loots: [
    {
      itemBlueprintKey: BootsBlueprint.JadeEmperorsBoot,
      chance: 20,
    },
    {
      itemBlueprintKey: SpearsBlueprint.BohemianEarspoon,
      chance: 15,
    },
    {
      itemBlueprintKey: ShieldsBlueprint.DwarvenShield,
      chance: 20,
    },
    {
      itemBlueprintKey: FoodsBlueprint.CheeseSlice,
      chance: 15,
    },
    {
      itemBlueprintKey: StaffsBlueprint.RubyStaff,
      chance: 10,
    },
    {
      itemBlueprintKey: AccessoriesBlueprint.GlacialRing,
      chance: 10,
    },
  ],
};
