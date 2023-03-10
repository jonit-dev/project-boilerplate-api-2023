import { INPC } from "@entities/ModuleNPC/NPCModel";
import { MagicsBlueprint, PotionsBlueprint, StaffsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CharacterGender } from "@rpg-engine/shared";
import { generateRandomMovement } from "../../abstractions/BaseNeutralNPC";

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
      key: MagicsBlueprint.FireBoltRune,
    },
    {
      key: MagicsBlueprint.PoisonRune,
    },
    {
      key: StaffsBlueprint.FireStaff,
    },
    {
      key: StaffsBlueprint.CorruptionStaff,
    },
  ],
} as Partial<INPC>;
