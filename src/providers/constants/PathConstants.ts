import path from "path";
import root from "root-path";

const rootStr = root();

export const ROOT_PATH = `${rootStr}/`;

// Paths
export const STATIC_PATH = path.join(ROOT_PATH, "./public");

export const SRC_PATH = path.join(ROOT_PATH, "./src");

export const DATA_PATH = path.join(ROOT_PATH, "./src/providers/data");

export const ENV_KEYS_PATH = path.join(ROOT_PATH, "./environment/keys");
