import { allClassesSpellsIndex } from "./all";
import { berserkerSpellsIndex } from "./berserker";
import { druidSpellsIndex } from "./druid";
import { druidSorcererSpellsIndex } from "./druid-sorcerer";
import { dwarfSpellsIndex } from "./dwarf";
import { elfSpellsIndex } from "./elf";
import { humanSpellsIndex } from "./human";
import { hunterSpellsIndex } from "./hunter";
import { minotaurSpellsIndex } from "./minotaur";
import { orcSpellsIndex } from "./orc";
import { rogueSpellsIndex } from "./rogue";
import { rogueHunterSpellsIndex } from "./rogue-hunter";
import { sorcererSpellsIndex } from "./sorcerer";
import { warriorSpellsIndex } from "./warrior";
import { berserkerWarriorSpellsIndex } from "./berserker-warrior";

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
  ...dwarfSpellsIndex,
  ...elfSpellsIndex,
  ...humanSpellsIndex,
  ...orcSpellsIndex,
  ...minotaurSpellsIndex,
  ...berserkerWarriorSpellsIndex,
};
