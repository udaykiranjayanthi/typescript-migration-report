# typescript-migration-report

`typescript-migration-report` is an npm library that helps you calculate the percentage of TypeScript and JavaScript files in your codebase, assisting in tracking progress during migration from JavaScript to TypeScript.

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
  _____                          _      _   
 |_   _|  _ _ __  ___ ___ __ _ _(_)_ __| |_ 
   | || || | '_ \/ -_|_-</ _| '_| | '_ \  _|
   |_| \_, | .__/\___/__/\__|_| |_| .__/\__|
       |__/|_|                    |_|       

+----------------+--------------+--------------+--------------+--------------+
|                |   Code files |   Test files |   Code lines |   Test lines |
+----------------+--------------+--------------+--------------+--------------+
|     JavaScript |            3 |            0 |           54 |            0 |
+----------------+--------------+--------------+--------------+--------------+
|     TypeScript |            3 |            0 |          283 |            0 |
+----------------+--------------+--------------+--------------+--------------+
|            All |            6 |            0 |          337 |            0 |
+----------------+--------------+--------------+--------------+--------------+
|   TypeScript % |      50.00 % |       0.00 % |      83.98 % |       0.00 % |
+----------------+--------------+--------------+--------------+--------------+
Overall Typescript %:   83.98 %
```

This report shows the number of TypeScript and JavaScript files and lines of code in your project, along with the percentage of TypeScript files, helping you track your migration progress.

## Configuration

The `tsreport.config.js` file is where you can configure your patterns and exclusions. Here’s what each part does:

- `patterns`: Defines the file patterns for TypeScript and JavaScript files (including tests).
- `rootDir`: Specifies the root directory of your project.
- `exclude`: Allows you to exclude specific directories or files, like `node_modules` or `dist`.

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
  exclude: ["node_modules/**", "dist/**"],
};
```

## License

MIT License
```
This README outlines how to install, configure, and use your library, along with example output and configuration details. Let me know if you need any additional sections!
```