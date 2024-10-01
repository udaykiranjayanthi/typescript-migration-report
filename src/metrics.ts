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

  let totalLines = 0;
  files.forEach((file) => {
    const filePath = path.join(config.rootDir, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    totalLines += fileContent.split("\n").length;
  });

  return [files.length, totalLines];
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
  const totalCodeFilesCount = jsCodeFilesCount + tsCodeFilesCount;
  const totalTestFilesCount = jsTestFilesCount + tsTestFilesCount;

  // Calculate total lines
  const totalLines = tsLinesCount + jsLinesCount;
  const totalTestLines = tsTestLinesCount + jsTestLinesCount;
  const totalCodeLines = tsCodeLinesCount + jsCodeLinesCount;

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
    (tsTestLinesCount * 100) / totalTestLines || 0
  ).toFixed(2);
  const tsCodePercentage = (
    (tsCodeLinesCount * 100) / totalCodeLines || 0
  ).toFixed(2);
  const tsPercentage = ((tsLinesCount * 100) / totalLines || 0).toFixed(2);
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

  console.log(asciiArt);

  printTable(headers, data);

  console.log(
    `${ANSI.bold}Overall Typescript %: \t${mapColor(
      tsPercentage
    )}${tsPercentage} %${ANSI.reset}\n`
  );
}
