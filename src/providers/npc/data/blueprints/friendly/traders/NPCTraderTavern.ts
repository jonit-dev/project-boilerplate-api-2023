import { INPC } from "@entities/ModuleNPC/NPCModel";
import { FoodsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { generateRandomMovement } from "@providers/npc/data/abstractions/BaseNeutralNPC";
import { CharacterGender } from "@rpg-engine/shared";

export const npcTraderTavern = {
  ...generateRandomMovement(),
  key: "trader-tavern",
  name: "Helia, the Tavern Keeper",
  textureKey: "human-girl-1",
  gender: CharacterGender.Female,
  isTrader: true,
  traderItems: [
    {
      key: FoodsBlueprint.RedMeat,
    },
    {
      key: FoodsBlueprint.Salmon,
    },

    {
      key: FoodsBlueprint.Bread,
    },
    {
      key: FoodsBlueprint.ChickensMeat,
    },
  ],
} as Partial<INPC>;
