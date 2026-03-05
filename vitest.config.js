import { defineConfig } from "vitest/config";
export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./src/tests/setup.js"], //runs before every test file
    testTimeout: 10000, //10s timout for async tests
    pool: "forks", //isolate each test file
    env: {
      NODE_ENV: "test",
    },
  },
});
