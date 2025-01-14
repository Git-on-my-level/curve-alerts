// Mock AWS Lambda ScheduledEvent
const mockEvent = {
  version: "0",
  id: "local-test",
  "detail-type": "Scheduled Event",
  source: "aws.events",
  account: "local",
  time: new Date().toISOString(),
  region: "local",
  resources: ["local"],
  detail: {},
};

console.log("Running lambda handler with mock event...\n");

// Import and run the lambda
const lambda = await import("../dist/lambda/index.cjs");
try {
  await lambda.handler(mockEvent);
  console.log("\nLambda execution completed");
} catch (error) {
  console.error("Error running lambda:", error);
  process.exit(1);
}
