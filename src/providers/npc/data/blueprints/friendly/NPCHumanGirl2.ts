import { INPC } from "@entities/ModuleNPC/NPCModel";
import { FriendlyNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { CharacterClass, CharacterGender } from "@rpg-engine/shared";
import { generateRandomMovement } from "../../abstractions/BaseNeutralNPC";

export const npcHumanGirl2 = {
  ...generateRandomMovement(),
  name: "Ursula",
  textureKey: FriendlyNPCsBlueprint.HumanGirl2,
  key: FriendlyNPCsBlueprint.HumanGirl2,
  class: CharacterClass.None,
  gender: CharacterGender.Male,
} as Partial<INPC>;
