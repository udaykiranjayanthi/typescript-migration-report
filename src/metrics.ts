import * as fs from "fs";
import { glob } from "glob";
import * as path from "path";
import { ANSI, printTable } from "./table";

export interface Config {
  patterns: Patterns;
  rootDir: string;
  exclude: string[];
}

export interface Patterns {
  typescript: string;
  typescriptTests: string;
  javascript: string;
  javascriptTests: string;
}

// Function to validate the configuration
function validateConfig(config: any): asserts config is Config {
  if (
    !config.rootDir ||
    !config.patterns ||
    !config.patterns.typescript ||
    !config.patterns.typescriptTests ||
    !config.patterns.javascript ||
    !config.patterns.javascriptTests ||
    !config.exclude ||
    !Array.isArray(config.exclude)
  ) {
    throw new Error("Invalid configuration format");
  }
}

// Helper function to count files by pattern
const countFiles = async (pattern: string, config: Config) => {
  const files = await glob(pattern, {
    cwd: config.rootDir,
    ignore: config.exclude,
  });
  return files.length;
};

// Helper function to count total lines in files by pattern
const countLines = async (pattern: string, config: Config) => {
  const files = await glob(pattern, {
    cwd: config.rootDir,
    ignore: config.exclude,
  });

  if (files.length === 0) {
    return 0;
  }

  let totalLines = 0;
  files.forEach((file) => {
    const filePath = path.join(config.rootDir, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    totalLines += fileContent.split("\n").length;
  });

  return totalLines;
};

// Map colors based on percentage
const mapColor = (percent: string) => {
  const value = parseFloat(percent);

  if (value >= 75) {
    return ANSI.green;
  } else if (value >= 40) {
    return ANSI.yellow;
  } else {
    return ANSI.red;
  }
};

// Main logic
export async function calculateMetrics(config: Config) {
  //Validating config
  validateConfig(config);

  // Count TypeScript files
  const tsFilesCount = await countFiles(config.patterns.typescript, config);
  const tsTestFilesCount = await countFiles(
    config.patterns.typescriptTests,
    config
  );
  const tsCodeFilesCount = tsFilesCount - tsTestFilesCount;

  // Count JavaScript files
  const jsFilesCount = await countFiles(config.patterns.javascript, config);
  const jsTestFilesCount = await countFiles(
    config.patterns.javascriptTests,
    config
  );
  const jsCodeFilesCount = jsFilesCount - jsTestFilesCount;

  // Count lines for TypeScript
  const totalTsLines = await countLines(config.patterns.typescript, config);
  const totalTsTestLines = await countLines(
    config.patterns.typescriptTests,
    config
  );
  const totalTsCodeLines = totalTsLines - totalTsTestLines;

  // Count lines for JavaScript
  const totalJsLines = await countLines(config.patterns.javascript, config);
  const totalJsTestLines = await countLines(
    config.patterns.javascriptTests,
    config
  );
  const totalJsCodeLines = totalJsLines - totalJsTestLines;

  // Calculate total files
  const totalCodeFilesCount = jsCodeFilesCount + tsCodeFilesCount;
  const totalTestFilesCount = jsTestFilesCount + tsTestFilesCount;

  // Calculate total lines
  const totalLines = totalTsLines + totalJsLines;
  const totalTestLines = totalTsTestLines + totalJsTestLines;
  const totalCodeLines = totalTsCodeLines + totalJsCodeLines;

  // Check if there are any lines
  if (totalLines === 0) {
    console.log("No JavaScript or TypeScript code found.");
    return;
  }

  // Calculate percentages (keeping in mind your preference for floor division)
  const tsCodeFilePercentage = (
    (tsCodeFilesCount * 100) / totalCodeFilesCount || 0
  ).toFixed(2);
  const tsTestFilePercentage = (
    (tsTestFilesCount * 100) / totalTestFilesCount || 0
  ).toFixed(2);
  const tsTestPercentage = (
    (totalTsTestLines * 100) / totalTestLines || 0
  ).toFixed(2);
  const tsCodePercentage = (
    (totalTsCodeLines * 100) / totalCodeLines || 0
  ).toFixed(2);
  // Display results
  // Prepare data for table

  const headers = [
    " ".repeat(12),
    "Code files",
    "Test files",
    "Code lines",
    "Test lines",
  ];

  const tableData = [
    {
      title: { data: "JavaScript", color: ANSI.yellow },
      code_files: { data: jsCodeFilesCount, color: ANSI.default },
      test_files: { data: jsTestFilesCount, color: ANSI.default },
      code_lines: { data: totalJsCodeLines, color: ANSI.default },
      test_lines: { data: totalJsTestLines, color: ANSI.default },
    },
    {
      title: { data: "TypeScript", color: ANSI.cyan },
      code_files: { data: tsCodeFilesCount, color: ANSI.default },
      test_files: { data: tsTestFilesCount, color: ANSI.default },
      code_lines: { data: totalTsCodeLines, color: ANSI.default },
      test_lines: { data: totalTsTestLines, color: ANSI.default },
    },
    {
      title: { data: "All", color: ANSI.default },
      code_files: { data: totalCodeFilesCount, color: ANSI.default },
      test_files: { data: totalTestFilesCount, color: ANSI.default },
      code_lines: { data: totalCodeLines, color: ANSI.default },
      test_lines: { data: totalTestLines, color: ANSI.default },
    },
    {
      title: { data: "TypeScript %", color: ANSI.yellow },
      code_files: {
        data: `${tsCodeFilePercentage} %`,
        color: mapColor(tsCodeFilePercentage),
      },
      test_files: {
        data: `${tsTestFilePercentage} %`,
        color: mapColor(tsTestFilePercentage),
      },
      code_lines: {
        data: `${tsCodePercentage} %`,
        color: mapColor(tsCodePercentage),
      },
      test_lines: {
        data: `${tsTestPercentage} %`,
        color: mapColor(tsTestPercentage),
      },
    },
  ];

  const data = tableData.map((row) => [
    row.title,
    row.code_files,
    row.test_files,
    row.code_lines,
    row.test_lines,
  ]);

  printTable(headers, data);
}
