import { CharacterClass, CharacterGender, FromGridX, FromGridY, GRID_WIDTH, INPC, MapLayers } from "@rpg-engine/shared";

interface INPCMetaData extends Omit<INPC, "_id"> {
  key: string;
  maxRangeInGridCells?: number;
}

export const NPCMetaData: INPCMetaData[] = [
  {
    key: "alice",
    name: "Alice",
    x: FromGridX(22),
    y: FromGridY(12),
    direction: "down",
    scene: "MainScene",
    class: CharacterClass.None,
    gender: CharacterGender.Female,
    layer: MapLayers.Player,
    maxRangeInGridCells: GRID_WIDTH * 5,
  },
];
