import { handler } from "./index.js";

const testEvent = {
  time: "2023-01-01T00:00:00Z",
  detail: {},
};

async function runLocal() {
  try {
    const result = await handler(testEvent);
    console.log("Lambda execution result:", result);
  } catch (error) {
    console.error("Lambda execution error:", error);
  }
}

runLocal();
