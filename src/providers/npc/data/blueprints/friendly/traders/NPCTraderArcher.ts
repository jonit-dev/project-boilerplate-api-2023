import { INPC } from "@entities/ModuleNPC/NPCModel";
import { RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { generateRandomMovement } from "@providers/npc/data/abstractions/BaseNeutralNPC";
import { CharacterGender } from "@rpg-engine/shared";

export const npcTraderArcher = {
  ...generateRandomMovement(),
  key: "trader-archer",
  name: "Aiden the Archer",
  textureKey: "elf-white-hair-1",
  gender: CharacterGender.Male,
  isTrader: true,
  traderItems: [
    {
      key: RangedWeaponsBlueprint.Slingshot,
    },
    {
      key: RangedWeaponsBlueprint.Stone,
    },
    {
      key: RangedWeaponsBlueprint.Bow,
    },
    {
      key: RangedWeaponsBlueprint.Arrow,
    },
    {
      key: RangedWeaponsBlueprint.IronArrow,
    },
    {
      key: RangedWeaponsBlueprint.Shuriken,
    },
  ],
} as Partial<INPC>;
