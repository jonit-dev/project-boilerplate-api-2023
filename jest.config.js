/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

module.exports = {
  preset: "ts-jest/presets/default-esm",
  injectGlobals: true,
  transform: {
    "^.+\\.(ts|tsx)?$": "ts-jest",
  },
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
  extensionsToTreatAsEsm: [".tsx"],
  testEnvironment: "node",
  setupFiles: ["dotenv/config"],
  modulePathIgnorePatterns: ["dist"],
  moduleNameMapper: {
    "^@providers/(.*)$": "<rootDir>/src/providers/$1",
    "^@entities/(.*)$": "<rootDir>/src/entities/$1",
    "^@repositories/(.*)$": "<rootDir>/src/repositories/$1",
    "^@useCases/(.*)$": "<rootDir>/src/useCases/$1",
    "^@data/(.*)$": "<rootDir>/src/data/$1",
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};
