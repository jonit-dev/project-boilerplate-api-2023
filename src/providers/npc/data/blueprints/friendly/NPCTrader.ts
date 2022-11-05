import { INPC } from "@entities/ModuleNPC/NPCModel";
import { PotionsBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
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
      price: 15,
      texturePath: "potions/light-endurance-potion.png",
      name: "Poção Braba",
    },
    {
      key: SwordsBlueprint.ShortSword,
      price: 50,
      texturePath: "swords/short-sword.png",
      name: "Espada fraca",
    },
  ],
} as Partial<INPC>;
