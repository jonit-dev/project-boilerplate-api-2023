import { CharacterFactions } from "@rpg-engine/shared";

type IInitialSpawnPoints = {
  [faction in CharacterFactions]: {
    gridX: number;
    gridY: number;
    scene: string;
  };
};

export const INITIAL_STARTING_POINTS: IInitialSpawnPoints = {
  [CharacterFactions.LifeBringer]: {
    gridX: 26,
    gridY: 17,
    scene: "ilya-village-sewer",
  },
  [CharacterFactions.ShadowWalker]: {
    gridX: 100,
    gridY: 15,
    scene: "shadowlands-sewer",
  },
};
