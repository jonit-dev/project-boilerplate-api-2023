import { INPC } from "@entities/ModuleNPC/NPCModel";
import {
  ArmorsBlueprint,
  AxesBlueprint,
  BootsBlueprint,
  GlovesBlueprint,
  HelmetBlueprint,
  MacesBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/item/data/types/npcsBlueprintTypes";
import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcOrc = {
  ...generateMoveTowardsMovement(),
  name: "Orc",
  key: HostileNPCsBlueprint.Orc,
  textureKey: HostileNPCsBlueprint.Orc,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: 2,
  skills: {
    level: 3,
    strength: {
      level: 3,
    },
    dexterity: {
      level: 3,
    },
  },
  fleeOnLowHealth: true,
  experience: 14,
  loots: [
    {
      itemBlueprintKey: BootsBlueprint.Boots,
      chance: 30,
    },
    {
      itemBlueprintKey: AxesBlueprint.Axe,
      chance: 30,
    },
    {
      itemBlueprintKey: HelmetBlueprint.StuddedHelmet,
      chance: 15,
    },
    {
      itemBlueprintKey: ArmorsBlueprint.StuddedArmor,
      chance: 15,
    },
    {
      itemBlueprintKey: BootsBlueprint.StuddedBoots,
      chance: 15,
    },
    {
      itemBlueprintKey: GlovesBlueprint.StuddedGloves,
      chance: 15,
    },
    {
      itemBlueprintKey: MacesBlueprint.SpikedClub,
      chance: 10,
    },
  ],
} as Partial<INPC>;
