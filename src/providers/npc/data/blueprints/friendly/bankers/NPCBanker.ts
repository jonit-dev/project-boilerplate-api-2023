import { generateRandomMovement } from "@providers/npc/data/abstractions/BaseNeutralNPC";
import { CharacterGender } from "@rpg-engine/shared";

export const npcBanker = {
  ...generateRandomMovement(),
  key: "banker",
  name: "Elara the Banker",
  textureKey: "dynasty-woman-1",
  gender: CharacterGender.Female,
  hasDepot: true,
};
