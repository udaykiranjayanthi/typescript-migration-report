import { calculateMetrics } from "./metrics";

// Change this to your desired directory
const targetDir = "./src";

calculateMetrics(targetDir).catch((err) => console.error(err));
