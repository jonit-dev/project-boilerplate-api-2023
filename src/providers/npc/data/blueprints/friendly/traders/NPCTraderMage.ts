import { INPC } from "@entities/ModuleNPC/NPCModel";
import { BooksBlueprint, HelmetsBlueprint, StaffsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
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
      key: StaffsBlueprint.AirWand,
    },
    {
      key: StaffsBlueprint.Wand,
    },
    {
      key: HelmetsBlueprint.WizardHat,
    },
    {
      key: BooksBlueprint.MysticWardenCodex,
    },
    {
      key: BooksBlueprint.EmberSageScripture,
    },
  ],
} as Partial<INPC>;
