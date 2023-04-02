import { allClassesSpellsIndex } from "./all";
import { berserkerSpellsIndex } from "./berserker";
import { druidSpellsIndex } from "./druid";
import { druidSorcererSpellsIndex } from "./druid-sorcerer";
import { hunterSpellsIndex } from "./hunter";
import { rogueSpellsIndex } from "./rogue";
import { sorcererSpellsIndex } from "./sorcerer";
import { warriorSpellsIndex } from "./warrior";

export const spellsBlueprints = {
  ...allClassesSpellsIndex,
  ...hunterSpellsIndex,
  ...druidSpellsIndex,
  ...druidSorcererSpellsIndex,
  ...sorcererSpellsIndex,
  ...berserkerSpellsIndex,
  ...rogueSpellsIndex,
  ...warriorSpellsIndex,
};
