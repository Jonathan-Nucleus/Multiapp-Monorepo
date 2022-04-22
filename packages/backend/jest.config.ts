/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
  clearMocks: true,
  collectCoverage: false,
  moduleDirectories: ["node_modules"],
  moduleFileExtensions: ["js", "ts", "json"],
  preset: "ts-jest",
  resetMocks: true,
  rootDir: "",
  setupFiles: ["./__tests__/config/dotenv-config.ts"],
  setupFilesAfterEnv: ["./__tests__/config/jest.setup.ts"],
  testEnvironment: "node",
  testPathIgnorePatterns: ["/node_modules/"],
  testRegex: ".spec.ts$",
  transform: {
    ".+\\.(t|j)s$": "ts-jest",
  },
};
