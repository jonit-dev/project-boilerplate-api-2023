import { CharacterClass, CharacterGender, INPC, MapLayers } from "@rpg-engine/shared";

interface INPCMetaData extends Omit<INPC, "_id"> {}

export const NPCMetaData: INPCMetaData[] = [
  {
    name: "Alice",
    x: 160,
    y: 192,
    direction: "down",
    scene: "MainScene",
    class: CharacterClass.None,
    gender: CharacterGender.Female,
    texture: "npc-alice",
    layer: MapLayers.Player,
  },
];
