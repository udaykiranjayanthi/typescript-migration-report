# typescript-migration-report

An npm library that helps you calculate the percentage of TypeScript and JavaScript files in your codebase, assisting in tracking progress during migration from JavaScript to TypeScript.

## Installation

You can install the library using `yarn`:

```bash
yarn add typescript-migration-report --dev
```

Or using `npm`:

```bash
npm install typescript-migration-report --save-dev
```

## Usage

To use this tool, you need to add a custom script in your `package.json`:

```json
"scripts": {
  "ts-report": "typescript-migration-report"
}
```

After setting up the script, create a `tsreport.config.js` file in the root directory of your project with the following configuration:

```javascript
module.exports = {
  patterns: {
    typescript: "**/*.{ts,tsx}",
    typescriptTests: "**/*.test.{ts,tsx}",
    javascript: "**/*.{js,jsx}",
    javascriptTests: "**/*.test.{js,jsx}",
  },
  rootDir: "./",
  exclude: ["node_modules/**", "dist/**"],
  generateReport: true,
  logFiles: {
    typescript: true,
    javascript: true,
  },
};
```

## Running the Report

Run the command:

```bash
yarn ts-report
```

Or using npm:

```bash
npm run ts-report
```

The output will look like this in the terminal:

```
Scanning typescript files
⤷ src/table.ts
⤷ src/metrics.ts
⤷ src/index.ts

Scanning javascript files
⤷ tsreport.config.js
⤷ rollup.config.js
⤷ bin/ts-report.js

  _____                          _      _   
 |_   _|  _ _ __  ___ ___ __ _ _(_)_ __| |_ 
   | || || | '_ \/ -_|_-</ _| '_| | '_ \  _|
   |_| \_, | .__/\___/__/\__|_| |_| .__/\__|
       |__/|_|                    |_|       

+----------------+--------------+--------------+--------------+--------------+
|                |   Code files |   Test files |   Code lines |   Test lines |
+----------------+--------------+--------------+--------------+--------------+
|     JavaScript |            3 |            0 |           62 |            0 |
+----------------+--------------+--------------+--------------+--------------+
|     TypeScript |            3 |            0 |          363 |            0 |
+----------------+--------------+--------------+--------------+--------------+
|            All |            6 |            0 |          425 |            0 |
+----------------+--------------+--------------+--------------+--------------+
|   TypeScript % |      50.00 % |       0.00 % |      85.41 % |       0.00 % |
+----------------+--------------+--------------+--------------+--------------+
Overall Typescript (Lines) %:   85.41 %
Overall Typescript (Files) %:   50.00 %

Report file generated: typescript-migration-report.json
```

This report shows the number of TypeScript and JavaScript files and lines of code in your project, along with the percentage of TypeScript files, helping you track your migration progress.

## Configuration

The `tsreport.config.js` file is where you can configure your patterns and exclusions. Here’s what each part does:

- `patterns`: Defines the file patterns for TypeScript and JavaScript files (including tests).
- `rootDir`: Specifies the root directory of your project.
- `exclude`: Allows you to exclude specific directories or files, like `node_modules` or `dist`.
- `generateReport`: Allows you to generate a report file in JSON format, which can be used for CICD pipelines. 
- `logFiles`: Allows logging of scanned files. This helps in debugging or tracking the progress of TypeScript migration. You can enable logging for each file type separately by setting the respective flags to true.

Please refer to [Glob documentation](https://www.npmjs.com/package/glob) to understand more about the file/directory patterns

### Example Configuration:

```javascript
module.exports = {
  patterns: {
    typescript: "**/*.{ts,tsx}", //This includes test files also
    typescriptTests: "**/*.test.{ts,tsx}",
    javascript: "**/*.{js,jsx}", //This includes test files also
    javascriptTests: "**/*.test.{js,jsx}",
  },
  rootDir: "./",
  exclude: ["node_modules/**", "dist/**", "coverage/**"],
  generateReport: false,
  logFiles: {
    typescript: true,
    typescriptTests: false,
    javascript: true,
    javascriptTests: false,
  },
};
```

## License

MIT License
```
This README outlines how to install, configure, and use your library, along with example output and configuration details. Let me know if you need any additional sections!
```