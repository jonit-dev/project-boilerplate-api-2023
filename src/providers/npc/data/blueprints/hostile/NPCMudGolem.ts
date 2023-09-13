import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import {
  ArmorsBlueprint,
  BootsBlueprint,
  CraftingResourcesBlueprint,
  FoodsBlueprint,
  GlovesBlueprint,
  HammersBlueprint,
  ShieldsBlueprint,
  SpearsBlueprint,
  StaffsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { NPCAlignment, NPCSubtype } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcMudGolem: Partial<INPC> = {
  ...generateMoveTowardsMovement(),
  name: "Mud Golem",
  key: HostileNPCsBlueprint.MudGolem,
  subType: NPCSubtype.Elemental,
  textureKey: HostileNPCsBlueprint.MudGolem,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: MovementSpeed.Slow,
  baseHealth: 1500,
  healthRandomizerDice: Dice.D6,
  canSwitchToRandomTarget: true,
  skillRandomizerDice: Dice.D4,
  skillsToBeRandomized: ["level", "strength", "dexterity", "resistance"],
  skills: {
    level: 40,
    strength: {
      level: 40,
    },
    dexterity: {
      level: 10,
    },
    resistance: {
      level: 100,
    },
    magicResistance: {
      level: 40,
    },
  },
  fleeOnLowHealth: true,
  loots: [
    {
      itemBlueprintKey: BootsBlueprint.CopperBoots,
      chance: 20,
    },
    {
      itemBlueprintKey: SpearsBlueprint.RoyalSpear,
      chance: 15,
    },
    {
      itemBlueprintKey: GlovesBlueprint.PlateGloves,
      chance: 15,
    },
    {
      itemBlueprintKey: ShieldsBlueprint.StoneShield,
      chance: 20,
    },
    {
      itemBlueprintKey: ArmorsBlueprint.FalconsArmor,
      chance: 1,
    },
    {
      itemBlueprintKey: FoodsBlueprint.Fish,
      chance: 30,
    },

    {
      itemBlueprintKey: StaffsBlueprint.FireWand,
      chance: 10,
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.PolishedStone,
      chance: 10,
      quantityRange: [1, 5],
    },
    {
      itemBlueprintKey: HammersBlueprint.DragonFistHammer,
      chance: 10,
    },
    {
      itemBlueprintKey: StaffsBlueprint.GravityStaff,
      chance: 10,
    },
  ],
};
