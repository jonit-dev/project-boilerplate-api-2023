import { INPC } from "@entities/ModuleNPC/NPCModel";
import { CraftingResourcesBlueprint, ToolsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { FriendlyNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { CharacterGender } from "@rpg-engine/shared";
import { generateRandomMovement } from "../../../abstractions/BaseNeutralNPC";

export const npcTrader = {
  ...generateRandomMovement(),
  key: "trader",
  name: "Trader Joe",
  textureKey: FriendlyNPCsBlueprint.Trader,
  gender: CharacterGender.Male,
  isTrader: true,
  traderItems: [
    {
      key: CraftingResourcesBlueprint.Bandage,
    },
    {
      key: CraftingResourcesBlueprint.Rope,
    },
    {
      key: ToolsBlueprint.ButchersKnife,
    },
    {
      key: ToolsBlueprint.Hammer,
    },
    {
      key: ToolsBlueprint.Pickaxe,
    },
    {
      key: ToolsBlueprint.CarpentersAxe,
    },
  ],
} as Partial<INPC>;
