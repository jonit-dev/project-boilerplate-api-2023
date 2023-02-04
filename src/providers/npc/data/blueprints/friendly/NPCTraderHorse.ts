import { INPC } from "@entities/ModuleNPC/NPCModel";
import { MagicsBlueprint, PotionsBlueprint, StaffsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { FriendlyNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { CharacterGender } from "@rpg-engine/shared";
import { generateFixedPathMovement } from "../../abstractions/BaseNeutralNPC";

export const npcTraderHorse = {
  ...generateFixedPathMovement(),
  key: "trader-horse",
  name: "John Trader",
  textureKey: FriendlyNPCsBlueprint.TraderHorse,
  gender: CharacterGender.Male,
  isTrader: true,
  traderItems: [
    {
      key: PotionsBlueprint.LightEndurancePotion,
    },
    {
      key: PotionsBlueprint.ManaPotion,
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
