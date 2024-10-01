import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/index.ts", // Entry point
  output: [
    {
      file: "dist/index.cjs.js",
      format: "cjs", // CommonJS for Node.js
    },
    {
      file: "dist/index.esm.js",
      format: "esm", // ES Module for modern bundlers
    },
  ],
  plugins: [resolve(), commonjs(), typescript()],
  external: ["glob"], // Add external libraries you don’t want to bundle
};
