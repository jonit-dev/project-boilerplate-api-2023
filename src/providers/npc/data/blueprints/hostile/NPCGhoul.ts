import { INPC } from "@entities/ModuleNPC/NPCModel";
import { EXP_RATIO } from "@providers/constants/SkillConstants";
import {
  GlovesBlueprint,
  LegsBlueprint,
  MacesBlueprint,
  PotionsBlueprint,
  SpearsBlueprint,
  SwordBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/item/data/types/npcsBlueprintTypes";
import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcGhoul = {
  ...generateMoveTowardsMovement(),
  name: "Ghoul",
  key: HostileNPCsBlueprint.Ghoul,
  textureKey: HostileNPCsBlueprint.Ghoul,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: 3,
  skills: {
    level: 4,
    strength: {
      level: 4,
    },
    dexterity: {
      level: 1,
    },
    resistence: {
      level: 5,
    },
  },
  fleeOnLowHealth: false,
  experience: 16 * EXP_RATIO,
  loots: [
    {
      itemBlueprintKey: MacesBlueprint.SpikedClub,
      chance: 10,
    },
    {
      itemBlueprintKey: PotionsBlueprint.GreaterLifePotion,
      chance: 20,
    },
    {
      itemBlueprintKey: PotionsBlueprint.ManaPotion,
      chance: 10,
    },
    {
      itemBlueprintKey: LegsBlueprint.StuddedLegs,
      chance: 5,
    },
    {
      itemBlueprintKey: SwordBlueprint.DoubleEdgedSword,
      chance: 15,
    },
    {
      itemBlueprintKey: GlovesBlueprint.StuddedGloves,
      chance: 20,
    },
    {
      itemBlueprintKey: SpearsBlueprint.RoyalSpear,
      chance: 2.5,
    },
  ],
} as Partial<INPC>;
