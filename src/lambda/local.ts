import { handler } from "./index.js";

const testEvent = {
  id: "test-id",
  version: "0",
  account: "123456789012",
  region: "us-east-1",
  time: "2023-01-01T00:00:00Z",
  detail: {},
  "detail-type": "Scheduled Event" as const,
  source: "aws.events",
  resources: ["arn:aws:events:us-east-1:123456789012:event-bus/default"],
};

async function runLocal(): Promise<void> {
  try {
    const result = await handler(testEvent);
    console.log("Lambda execution result:", result);
  } catch (error) {
    console.error("Lambda execution error:", error);
  }
}

runLocal();
