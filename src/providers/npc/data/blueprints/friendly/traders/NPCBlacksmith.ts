import { INPC } from "@entities/ModuleNPC/NPCModel";
import {
  AccessoriesBlueprint,
  ArmorsBlueprint,
  AxesBlueprint,
  DaggersBlueprint,
  MacesBlueprint,
  SwordsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { generateRandomMovement } from "@providers/npc/data/abstractions/BaseNeutralNPC";
import { CharacterGender } from "@rpg-engine/shared";

export const npcBlacksmith = {
  ...generateRandomMovement(),
  key: "blacksmith",
  name: "Thorne Forgehammer",
  textureKey: "fat-bald-man",
  gender: CharacterGender.Male,
  isTrader: true,
  traderItems: [
    {
      key: SwordsBlueprint.ShortSword,
    },
    {
      key: DaggersBlueprint.IronDagger,
    },
    {
      key: ArmorsBlueprint.StuddedArmor,
    },
    {
      key: MacesBlueprint.Club,
    },
    {
      key: AxesBlueprint.Axe,
    },
    {
      key: AccessoriesBlueprint.AmuletOfDeath,
    },
  ],
} as Partial<INPC>;
