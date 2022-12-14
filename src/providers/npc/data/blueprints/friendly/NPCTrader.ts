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
import { generateRandomMovement } from "../../abstractions/BaseNeutralNPC";

export const npcTrader = {
  ...generateRandomMovement(),
  key: "trader",
  name: "Joe",
  textureKey: FriendlyNPCsBlueprint.Trader,
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
      key: SwordsBlueprint.ShortSword,
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
