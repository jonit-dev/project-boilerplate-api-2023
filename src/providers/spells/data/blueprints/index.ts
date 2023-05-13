import { allClassesSpellsIndex } from "./all";
import { berserkerSpellsIndex } from "./berserker";
import { druidSpellsIndex } from "./druid";
import { druidSorcererSpellsIndex } from "./druid-sorcerer";
import { hunterSpellsIndex } from "./hunter";
import { rogueSpellsIndex } from "./rogue";
import { rogueHunterSpellsIndex } from "./rogue-hunter";
import { sorcererSpellsIndex } from "./sorcerer";
import { warriorSpellsIndex } from "./warrior";

export const spellsBlueprints = {
  ...allClassesSpellsIndex,
  ...druidSpellsIndex,
  ...druidSorcererSpellsIndex,
  ...sorcererSpellsIndex,
  ...berserkerSpellsIndex,
  ...hunterSpellsIndex,
  ...rogueSpellsIndex,
  ...rogueHunterSpellsIndex,
  ...warriorSpellsIndex,
};
