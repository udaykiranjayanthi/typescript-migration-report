// ANSI escape codes for colors
export const ANSI = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  default: "\x1b[39m",
  grey: "\x1b[30m",
};

export type Cell = {
  color: string;
  data: string | number;
};

// Function to print a formatted table with borders and horizontal padding
export function printTable(headers: string[], rows: Cell[][]) {
  // Define column widths based on headers
  const columnWidths = headers.map((header) => header.length + 4); // Add padding for aesthetics

  // Function to align text to the right
  const rightAlign = (text: string, width: number) => {
    return text.padStart(width);
  };

  const cellSeparator = `${ANSI.grey}|${ANSI.reset}`;

  const rowSeparator =
    `${ANSI.grey}+` +
    headers
      .map((header, index) => `${"-".repeat(columnWidths[index])}`)
      .join("+") +
    `+${ANSI.reset}`;

  // Print the top border of the table
  console.log(rowSeparator);

  // Print header row
  console.log(
    cellSeparator +
      headers
        .map(
          (header, index) =>
            `${ANSI.bold}${ANSI.cyan} ${rightAlign(
              header,
              columnWidths[index] - 2
            )} ${ANSI.reset}`
        )
        .join(cellSeparator) +
      cellSeparator
  );

  console.log(rowSeparator);

  // Print data rows with horizontal padding
  for (const row of rows) {
    const formattedRow = row
      .map(
        (cell, index) =>
          `${ANSI.bold}${cell.color} ${rightAlign(
            cell.data.toString(),
            columnWidths[index] - 2
          )} ${ANSI.reset}`
      )
      .join(cellSeparator); // Add padding spaces
    console.log(cellSeparator + formattedRow + cellSeparator);

    // Print row separator
    console.log(rowSeparator);
  }
}
