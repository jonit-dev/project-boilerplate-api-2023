import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(ts)?$",
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest",
  },
  runtime: "@side/jest-runtime",
  testEnvironment: "node",
  setupFiles: ["dotenv/config", "./jestInitialSetup.ts"],
  modulePathIgnorePatterns: ["dist", "__tests__/mock"],
  moduleNameMapper: {
    "^@providers/(.*)$": "<rootDir>/src/providers/$1",
    "^@entities/(.*)$": "<rootDir>/src/entities/$1",
    "^@repositories/(.*)$": "<rootDir>/src/repositories/$1",
    "^@useCases/(.*)$": "<rootDir>/src/useCases/$1",
    "^@data/(.*)$": "<rootDir>/src/providers/data/$1",
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transformIgnorePatterns: ["/node_modules/"],
  cache: true,
  testPathIgnorePatterns: ["/node_modules/", "/__tests__/mock/"],
  workerIdleMemoryLimit: "1700MB",
  silent: true,
  logHeapUsage: true,
};

export default config;
