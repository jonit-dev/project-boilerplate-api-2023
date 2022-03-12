import {
  CharacterClass,
  CharacterGender,
  FixedPathOrientation,
  FromGridX,
  FromGridY,
  INPC,
  MapLayers,
  NPCMovementType,
} from "@rpg-engine/shared";

interface INPCMetaData extends Omit<INPC, "_id"> {
  key: string;
  maxRangeInGridCells?: number;
}

const NPCMetaData = new Map<string, INPCMetaData>();

NPCMetaData.set("alice", {
  key: "alice",
  name: "Alice",
  x: FromGridX(22),
  y: FromGridY(12),
  direction: "down",
  scene: "MainScene",
  class: CharacterClass.None,
  gender: CharacterGender.Female,
  layer: MapLayers.Player,
  movementType: NPCMovementType.FixedPath,
  // maxRangeInGridCells: GRID_WIDTH * 5,
  fixedPathOrientation: FixedPathOrientation.Forward, // must be forward!
  fixedPath: {
    endGridX: 7,
    endGridY: 5,
  },
});

export { NPCMetaData };
