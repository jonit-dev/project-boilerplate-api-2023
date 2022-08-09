import { INPC } from "@entities/ModuleNPC/NPCModel";
import { BootsBlueprint, GlovesBlueprint, MacesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/item/data/types/npcsBlueprintTypes";
import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcDwarfGuard = {
  ...generateMoveTowardsMovement(),
  name: "Dwarf Guard",
  key: HostileNPCsBlueprint.DwarfGuard,
  textureKey: HostileNPCsBlueprint.DwarfGuard,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: 4,
  skills: {
    level: 4,
    strength: {
      level: 4,
    },
    dexterity: {
      level: 5,
    },
  },
  fleeOnLowHealth: true,
  experience: 20,
  loots: [
    {
      itemBlueprintKey: BootsBlueprint.Boots,
      chance: 30,
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
