import * as fs from "fs";
import { glob } from "glob";
import * as path from "path";
import { ANSI, printTable } from "./table";

// Helper function to count files by pattern
const countFiles = async (pattern: string, targetDir: string) => {
  const files = await glob(pattern, { cwd: targetDir });
  return files.length;
};

// Helper function to count total lines in files by pattern
const countLines = async (pattern: string, targetDir: string) => {
  const files = await glob(pattern, { cwd: targetDir });

  if (files.length === 0) {
    return 0;
  }

  let totalLines = 0;
  files.forEach((file) => {
    const filePath = path.join(targetDir, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    totalLines += fileContent.split("\n").length;
  });

  return totalLines;
};

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
export async function calculateMetrics(targetDir: string) {
  // Count TypeScript files
  const tsFilesCount = await countFiles("**/*.{ts,tsx}", targetDir);
  const tsTestFilesCount = await countFiles("**/*.test.{ts,tsx}", targetDir);
  const tsCodeFilesCount = tsFilesCount - tsTestFilesCount;

  // Count JavaScript files
  const jsFilesCount = await countFiles("**/*.{js,jsx}", targetDir);
  const jsTestFilesCount = await countFiles("**/*.test.{js,jsx}", targetDir);
  const jsCodeFilesCount = jsFilesCount - jsTestFilesCount;

  // Count lines for TypeScript
  const totalTsLines = await countLines("**/*.{ts,tsx}", targetDir);
  const totalTsTestLines = await countLines("**/*.test.{ts,tsx}", targetDir);
  const totalTsCodeLines = totalTsLines - totalTsTestLines;

  // Count lines for JavaScript
  const totalJsLines = await countLines("**/*.{js,jsx}", targetDir);
  const totalJsTestLines = await countLines("**/*.test.{js,jsx}", targetDir);
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
