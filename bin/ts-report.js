#!/usr/bin/env node

import { calculateMetrics } from "../dist/index.esm.js";
import * as path from "path";
import * as fs from "fs";

// Get the current working directory where the user runs the command
const currentDir = process.cwd();

// Path to the config.js file
const configPath = path.join(currentDir, "tsreport.config.js");

// Check if config.js exists and read it
let config;
if (fs.existsSync(configPath)) {
  config = await import(configPath); // You can import it using require
} else {
  console.error("tsreport.config.js file not found in the current directory.");
  process.exit(1);
}

calculateMetrics(config.default, currentDir).catch((err) => console.error(err));
