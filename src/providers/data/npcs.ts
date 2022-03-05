import { CharacterClass, CharacterGender, INPC } from "@rpg-engine/shared";

export const NPCMetaData: INPC[] = [
  {
    name: "Alice",
    x: 160,
    y: 192,
    direction: "down",
    scene: "MainScene",
    class: CharacterClass.None,
    gender: CharacterGender.Female,
    texture: "npc-alice",
  },
];
