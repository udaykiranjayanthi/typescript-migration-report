export default {
  patterns: {
    typescript: "**/*.{ts,tsx}",
    typescriptTests: "**/*.test.{ts,tsx}",
    javascript: "**/*.{js,jsx}",
    javascriptTests: "**/*.test.{js,jsx}",
  },
  rootDir: "./",
  exclude: ["node_modules/**", "dist/**"],
  generateReport: true,
};
