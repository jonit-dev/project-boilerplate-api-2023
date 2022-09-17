import { INPC } from "@entities/ModuleNPC/NPCModel";
import { FriendlyNPCsBlueprint } from "@providers/item/data/types/npcsBlueprintTypes";
import { CharacterGender } from "@rpg-engine/shared";
import { generateRandomMovement } from "../../abstractions/BaseNeutralNPC";

export const npcFather = {
  ...generateRandomMovement(),
  key: FriendlyNPCsBlueprint.Father,
  name: "Father",
  textureKey: FriendlyNPCsBlueprint.SeniorKnight1,
  gender: CharacterGender.Male,
} as Partial<INPC>;
