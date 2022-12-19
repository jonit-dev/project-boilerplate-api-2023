import { INPC } from "@entities/ModuleNPC/NPCModel";
import {
  MagicsBlueprint,
  PotionsBlueprint,
  RangedWeaponsBlueprint,
  SwordsBlueprint,
  ToolsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { FriendlyNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { CharacterGender } from "@rpg-engine/shared";
import { generateFixedPathMovement } from "../../abstractions/BaseNeutralNPC";

export const npcTraderHorse = {
  ...generateFixedPathMovement(),
  key: "trader-horse",
  name: "John Trader",
  textureKey: FriendlyNPCsBlueprint.TraderHorse,
  gender: CharacterGender.Male,
  isTrader: true,
  traderItems: [
    {
      key: PotionsBlueprint.LightEndurancePotion,
    },
    {
      key: MagicsBlueprint.Rune,
    },
    {
      key: SwordsBlueprint.DoubleEdgedSword,
    },
    {
      key: ToolsBlueprint.ButchersKnife,
    },
    {
      key: ToolsBlueprint.CarpentersAxe,
    },
    {
      key: ToolsBlueprint.FishingRod,
    },
    {
      key: ToolsBlueprint.Pickaxe,
    },
    {
      key: RangedWeaponsBlueprint.Arrow,
    },
  ],
} as Partial<INPC>;
