import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "@shelf/jest-mongodb",
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(ts)?$",
  transform: {
    "^.+\\.(ts|tsx)?$": "ts-jest",
  },
  testEnvironment: "node",
  setupFiles: ["dotenv/config"],
  modulePathIgnorePatterns: ["dist", "__tests__/mock"],
  moduleNameMapper: {
    "^@providers/(.*)$": "<rootDir>/src/providers/$1",
    "^@entities/(.*)$": "<rootDir>/src/entities/$1",
    "^@repositories/(.*)$": "<rootDir>/src/repositories/$1",
    "^@useCases/(.*)$": "<rootDir>/src/useCases/$1",
    "^@data/(.*)$": "<rootDir>/src/providers/data/$1",
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  globals: {
    "ts-jest": {
      isolatedModules: true,
    },
  },
};

export default config;
