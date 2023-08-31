import { IRaid } from "./RaidManager";

export const availableRaids: IRaid[] = [
  {
    name: "Ilya Orc's Invasion",
    key: "orc-raid-ilya",
    startingMessage: "Orcs are invading Ilya! Defend the city!", // optional
    triggeringChance: 5,
    minDuration: 15,
  },
  {
    name: "Goblin Gangs",
    key: "goblin-gang-ilya",
    startingMessage: "Beware! Goblin gangs are assaulting travelers.", // optional
    triggeringChance: 10,
    minDuration: 10,
  },
  {
    name: "Orc Fortress Reinforcements",
    key: "orc-fortress-reinforcements",
    startingMessage: "Orc fortress is receiving reinforcements! Be Careful!", // optional
    triggeringChance: 15,
    minDuration: 10,
  },
];
