import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(ts)?$",
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest",
  },
  runtime: "@side/jest-runtime",
  testEnvironment: "node",
  setupFiles: ["dotenv/config", "./src/jest/jestInitialSetup.ts"],
  setupFilesAfterEnv: ["./src/jest/jestSetupFilesAfterEnv.ts"],
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
  testPathIgnorePatterns: ["/node_modules/", "/__tests__/mock/"],
  workerIdleMemoryLimit: "2000MB",
  logHeapUsage: true,
  bail: true, // Stop the test run when the first test fails
};

export default config;
