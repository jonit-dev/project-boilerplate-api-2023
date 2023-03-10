import { INPC } from "@entities/ModuleNPC/NPCModel";
import { generateRandomMovement } from "@providers/npc/data/abstractions/BaseNeutralNPC";
import { CharacterGender } from "@rpg-engine/shared";

export const npcTraderFood = {
  ...generateRandomMovement(),
  key: "trader-food",
  name: "Marisol the Baker",
  textureKey: "blue-mage-1",
  gender: CharacterGender.Male,
  isTrader: true,
  traderItems: [],
} as Partial<INPC>;
