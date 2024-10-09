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

const asciiArt = `
  _____                          _      _   
 |_   _|  _ _ __  ___ ___ __ _ _(_)_ __| |_ 
   | || || | '_ \\/ -_|_-</ _| '_| | '_ \\  _|
   |_| \\_, | .__/\\___/__/\\__|_| |_| .__/\\__|
       |__/|_|                    |_|       
`;

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

// Helper function to count total lines in files by pattern
const scanLines = async (pattern: string, config: Config) => {
  const files = await glob(pattern, {
    cwd: config.rootDir,
    ignore: config.exclude,
  });

  if (files.length === 0) {
    return [files.length, 0];
  }

  let totalLinesCount = 0;
  files.forEach((file) => {
    const filePath = path.join(config.rootDir, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    totalLinesCount += fileContent.split("\n").length;
  });

  return [files.length, totalLinesCount];
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

// Generate report as JSON
const generateReport = (data: Object, directory: string) => {
  const filename = "typescript-migration-report.json";
  const filePath = path.join(directory, filename);

  const jsonData = JSON.stringify(data, null, 2);
  fs.writeFileSync(filePath, jsonData, "utf8");

  console.log(`Report file saved generated: ${filename}`);
};

// Main logic
export async function calculateMetrics(config: Config, currentDir: string) {
  //Validating config
  validateConfig(config);

  // Count TypeScript files and lines
  const [tsFilesCount, tsLinesCount] = await scanLines(
    config.patterns.typescript,
    config
  );
  const [tsTestFilesCount, tsTestLinesCount] = await scanLines(
    config.patterns.typescriptTests,
    config
  );
  const tsCodeFilesCount = tsFilesCount - tsTestFilesCount;
  const tsCodeLinesCount = tsLinesCount - tsTestLinesCount;

  // Count JavaScript files and lines
  const [jsFilesCount, jsLinesCount] = await scanLines(
    config.patterns.javascript,
    config
  );
  const [jsTestFilesCount, jsTestLinesCount] = await scanLines(
    config.patterns.javascriptTests,
    config
  );
  const jsCodeFilesCount = jsFilesCount - jsTestFilesCount;
  const jsCodeLinesCount = jsLinesCount - jsTestLinesCount;

  // Calculate total files
  const totalFilesCount = tsFilesCount + jsFilesCount;
  const totalCodeFilesCount = jsCodeFilesCount + tsCodeFilesCount;
  const totalTestFilesCount = jsTestFilesCount + tsTestFilesCount;

  // Calculate total lines
  const totalLinesCount = tsLinesCount + jsLinesCount;
  const totalTestLinesCount = tsTestLinesCount + jsTestLinesCount;
  const totalCodeLinesCount = tsCodeLinesCount + jsCodeLinesCount;

  // Check if there are any lines
  if (totalLinesCount === 0) {
    console.log("No JavaScript or TypeScript code found.");
    return;
  }

  // Calculate percentages (keeping in mind your preference for floor division)
  const tsCodeFilesPercentage = (
    (tsCodeFilesCount * 100) / totalCodeFilesCount || 0
  ).toFixed(2);
  const tsTestFilesPercentage = (
    (tsTestFilesCount * 100) / totalTestFilesCount || 0
  ).toFixed(2);
  const tsTestLinesPercentage = (
    (tsTestLinesCount * 100) / totalTestLinesCount || 0
  ).toFixed(2);
  const tsCodeLinesPercentage = (
    (tsCodeLinesCount * 100) / totalCodeLinesCount || 0
  ).toFixed(2);
  const tsLinesPercentage = (
    (tsLinesCount * 100) / totalLinesCount || 0
  ).toFixed(2);
  const tsFilesPercentage = (
    (tsFilesCount * 100) / totalFilesCount || 0
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
      code_lines: { data: jsCodeLinesCount, color: ANSI.default },
      test_lines: { data: jsTestLinesCount, color: ANSI.default },
    },
    {
      title: { data: "TypeScript", color: ANSI.cyan },
      code_files: { data: tsCodeFilesCount, color: ANSI.default },
      test_files: { data: tsTestFilesCount, color: ANSI.default },
      code_lines: { data: tsCodeLinesCount, color: ANSI.default },
      test_lines: { data: tsTestLinesCount, color: ANSI.default },
    },
    {
      title: { data: "All", color: ANSI.default },
      code_files: { data: totalCodeFilesCount, color: ANSI.default },
      test_files: { data: totalTestFilesCount, color: ANSI.default },
      code_lines: { data: totalCodeLinesCount, color: ANSI.default },
      test_lines: { data: totalTestLinesCount, color: ANSI.default },
    },
    {
      title: { data: "TypeScript %", color: ANSI.yellow },
      code_files: {
        data: `${tsCodeFilesPercentage} %`,
        color: mapColor(tsCodeFilesPercentage),
      },
      test_files: {
        data: `${tsTestFilesPercentage} %`,
        color: mapColor(tsTestFilesPercentage),
      },
      code_lines: {
        data: `${tsCodeLinesPercentage} %`,
        color: mapColor(tsCodeLinesPercentage),
      },
      test_lines: {
        data: `${tsTestLinesPercentage} %`,
        color: mapColor(tsTestLinesPercentage),
      },
    },
  ];

  // Print report as table
  const tableRows = tableData.map((row) => [
    row.title,
    row.code_files,
    row.test_files,
    row.code_lines,
    row.test_lines,
  ]);

  console.log(asciiArt);
  printTable(headers, tableRows);
  console.log(
    `${ANSI.bold}Overall Typescript (Lines) %: \t${mapColor(
      tsLinesPercentage
    )}${tsLinesPercentage} %${ANSI.reset}`
  );
  console.log(
    `${ANSI.bold}Overall Typescript (Files) %: \t${mapColor(
      tsFilesPercentage
    )}${tsFilesPercentage} %${ANSI.reset}\n`
  );

  // Generate report as a JSON
  const report = {
    codeFiles: {
      javascript: jsCodeFilesCount,
      typescript: tsCodeFilesCount,
      both: totalCodeFilesCount,
      typescriptPercentage: tsCodeFilesPercentage,
    },
    testFiles: {
      javascript: jsTestFilesCount,
      typescript: tsTestFilesCount,
      both: totalTestFilesCount,
      typescriptPercentage: tsTestFilesPercentage,
    },
    codeLines: {
      javascript: jsCodeLinesCount,
      typescript: tsCodeLinesCount,
      both: totalCodeLinesCount,
      typescriptPercentage: tsCodeLinesPercentage,
    },
    testLines: {
      javascript: jsTestLinesCount,
      typescript: tsTestLinesCount,
      both: totalTestLinesCount,
      typescriptPercentage: tsTestLinesPercentage,
    },
    overall: {
      typescriptLinesPercentage: tsLinesPercentage,
      typescriptFilesPercentage: tsFilesPercentage,
    },
  };

  generateReport(report, currentDir);
}
