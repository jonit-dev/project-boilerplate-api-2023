import { INPC } from "@entities/ModuleNPC/NPCModel";
import { MagicsBlueprint, PotionsBlueprint, StaffsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { generateRandomMovement } from "@providers/npc/data/abstractions/BaseNeutralNPC";
import { CharacterGender } from "@rpg-engine/shared";

export const npcTraderMage = {
  ...generateRandomMovement(),
  key: "trader-mage",
  name: "Lucius Shadowmoon",
  textureKey: "blue-mage-1",
  gender: CharacterGender.Male,
  isTrader: true,
  traderItems: [
    {
      key: PotionsBlueprint.LightAntidote,
    },
    {
      key: PotionsBlueprint.LightLifePotion,
    },
    {
      key: PotionsBlueprint.LightManaPotion,
    },
    {
      key: MagicsBlueprint.Rune,
    },
    {
      key: StaffsBlueprint.FireStaff,
    },
    {
      key: StaffsBlueprint.CorruptionStaff,
    },
  ],
} as Partial<INPC>;
