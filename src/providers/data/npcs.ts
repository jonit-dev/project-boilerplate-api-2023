import { CharacterClass, CharacterGender, INPC, MapLayers } from "@rpg-engine/shared";

interface INPCMetaData extends Omit<INPC, "_id"> {
  key: string;
}

export const NPCMetaData: INPCMetaData[] = [
  {
    key: "npc-alice",
    name: "Alice",
    x: 22 * 16,
    y: 12 * 16,
    direction: "down",
    scene: "MainScene",
    class: CharacterClass.None,
    gender: CharacterGender.Female,
    texture: "npc-alice",
    layer: MapLayers.Player,
  },
];
