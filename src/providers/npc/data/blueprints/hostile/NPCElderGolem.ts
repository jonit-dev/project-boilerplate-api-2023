import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import {
  ArmorsBlueprint,
  BootsBlueprint,
  CraftingResourcesBlueprint,
  GlovesBlueprint,
  HelmetsBlueprint,
  ShieldsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { NPCAlignment, NPCSubtype } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcElderGolem: Partial<INPC> = {
  ...generateMoveTowardsMovement(),
  name: "Elder Golem",
  key: HostileNPCsBlueprint.ElderGolem,
  subType: NPCSubtype.Elemental,
  textureKey: HostileNPCsBlueprint.ElderGolem,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: MovementSpeed.Slow,
  baseHealth: 120,
  healthRandomizerDice: Dice.D6,
  skillRandomizerDice: Dice.D4,
  skillsToBeRandomized: ["level", "strength", "dexterity"],
  canSwitchToLowHealthTarget: true,
  skills: {
    level: 18,
    strength: {
      level: 15,
    },
    dexterity: {
      level: 3,
    },
    resistance: {
      level: 15,
    },
  },
  loots: [
    {
      itemBlueprintKey: HelmetsBlueprint.SaviorsHelmet,
      chance: 20,
    },
    {
      itemBlueprintKey: ArmorsBlueprint.PlateArmor,
      chance: 5,
    },
    {
      itemBlueprintKey: GlovesBlueprint.ChainGloves,
      chance: 20,
    },
    {
      itemBlueprintKey: BootsBlueprint.RoyalBoots,
      chance: 5,
    },
    {
      itemBlueprintKey: ShieldsBlueprint.PlateShield,
      chance: 5,
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.GreaterWoodenLog,
      chance: 30,
      quantityRange: [1, 2],
    },
  ],
};
