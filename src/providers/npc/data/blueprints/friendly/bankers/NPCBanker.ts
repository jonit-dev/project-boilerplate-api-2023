import { generateStoppedMovement } from "@providers/npc/data/abstractions/BaseNeutralNPC";
import { CharacterGender } from "@rpg-engine/shared";

export const npcBanker = {
  ...generateStoppedMovement(),
  key: "banker",
  name: "Elara the Banker",
  textureKey: "dynasty-woman-1",
  gender: CharacterGender.Female,
  hasDepot: true,
};
