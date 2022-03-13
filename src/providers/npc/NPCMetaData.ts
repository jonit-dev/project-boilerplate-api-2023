import {
  CharacterClass,
  CharacterGender,
  FixedPathOrientation,
  FromGridX,
  FromGridY,
  GRID_WIDTH,
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
  textureKey: "female-npc",
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

NPCMetaData.set("maria", {
  key: "maria",
  name: "Maria",
  textureKey: "female-npc",
  x: FromGridX(21),
  y: FromGridY(10),
  direction: "down",
  scene: "MainScene",
  class: CharacterClass.None,
  gender: CharacterGender.Female,
  layer: MapLayers.Player,
  movementType: NPCMovementType.Random,
  maxRangeInGridCells: GRID_WIDTH * 5,
});

export { NPCMetaData };
