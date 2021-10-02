import { EnvType } from "@project-stock-alarm/shared/dist";
import path from "path";

import { appEnv } from "../config/env";

let ROOT_PATH;

switch (appEnv.general.ENV) {
  case EnvType.Development:
    ROOT_PATH = path.join(path.dirname(require.main!.filename || process.mainModule!.filename), "../"); // regular project folder... we're not inside dist here!
    break;
  case EnvType.Production:
  default:
    ROOT_PATH = path.join(path.dirname(require.main!.filename || process.mainModule!.filename), "../../"); // we add up an extra folder to get out of ./dist folder (no json files there, so it will break many of our ts script)
    break;
}

export { ROOT_PATH };

// Paths
export const STATIC_PATH = path.join(ROOT_PATH, "./public");

export const SRC_PATH = path.join(ROOT_PATH, "./src");

export const DATA_PATH = path.join(ROOT_PATH, "./src/providers/data");

export const ENV_KEYS_PATH = path.join(ROOT_PATH, "./environment/keys");
