import { IRaid } from "./RaidManager";

export const availableRaids: IRaid[] = [
  {
    name: "Ilya Orc's Invasion",
    key: "orc-raid-ilya",
    startingMessage: "Orcs are invading Ilya! Defend the city!",
    triggeringChance: 5,
    minDuration: 15,
  },
  {
    name: "Goblin Gangs",
    key: "goblin-gang-ilya",
    startingMessage: "Beware! Goblin gangs are assaulting travelers.",
    triggeringChance: 10,
    minDuration: 10,
  },
  {
    name: "Giant Spider hunt",
    key: "giant-spider-ilya",
    startingMessage: "Some Giant Spiders were spotting hunting around Ilya...Ugh!",
    triggeringChance: 5,
    minDuration: 5,
  },
  {
    name: "Orc Fortress Reinforcements",
    key: "orc-fortress-reinforcements",
    startingMessage: "Orc fortress is receiving reinforcements! Be Careful!",
    triggeringChance: 15,
    minDuration: 10,
  },
  {
    name: "Dwarf Mine Reinforcements",
    key: "dwarf-mine-reinforcements",
    startingMessage: "Did you hear that? Dwarf Mine rocks are trembling!",
    triggeringChance: 15,
    minDuration: 10,
  },
  {
    name: "Lifebringer Raid on Shadowlands",
    key: "lifebringer-raid-shadowlands",
    startingMessage: "Lightbringers are invading shadowlands! Elves and Dwarfs everywhere!",
    triggeringChance: 5,
    minDuration: 15,
  },
  {
    name: "Elora's Raid on Shadowlands",
    key: "elora-raid-shadowlands",
    startingMessage: "Elora, the Druid Queen, is invading shadowlands! Dark forces are going to be smashed!",
    triggeringChance: 1, // since raid checks are every hour, this makes 1 raid every 15 days
    minDuration: 15,
  },
  {
    name: "Malakar's Raid on Ilya",
    key: "malakar-raid-ilya",
    startingMessage: "Malakar, the Lich King, is invading Ilya! Evacuate immediately!",
    triggeringChance: 1, // since raid checks are every hour, this makes 1 raid every 15 days
    minDuration: 15,
  },
];
