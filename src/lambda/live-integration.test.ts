import { handler } from "./index";
import { IncomingWebhook } from "@slack/webhook";
import { config } from "./config";

// Mock modules first
jest.mock("@slack/webhook");
jest.mock("./config", () => ({
  config: {
    slackWebhookUrl: "dummy-webhook-url",
    chains: [
      {
        blockchainId: "ethereum",
        tokens: [
          {
            symbol: "USDT",
            address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
            threshold: 0.99,
          },
          {
            symbol: "USDC",
            address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
            threshold: 0.99,
          },
        ],
      },
      {
        blockchainId: "arbitrum",
        tokens: [
          {
            symbol: "USDT",
            address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
            threshold: 0.99,
          },
          {
            symbol: "USDC",
            address: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
            threshold: 0.99,
          },
        ],
      },
    ],
  },
}));

const mockedWebhook = {
  send: jest.fn(),
};
(IncomingWebhook as jest.Mock).mockImplementation(() => mockedWebhook);

describe("Live Curve API Integration Tests", () => {
  const mockEvent = {
    time: new Date().toISOString(),
    detail: {},
  };

  let apiResponse: any;
  let consoleSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeAll(async () => {
    consoleSpy = jest.spyOn(console, "log");
    consoleErrorSpy = jest.spyOn(console, "error");

    // Make the single API call that will be used by all tests
    await handler(mockEvent as any);

    // Store the console logs for testing
    apiResponse = consoleSpy.mock.calls;
  });

  afterAll(() => {
    consoleSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it("should successfully fetch prices for all configured tokens", () => {
    for (const chain of config.chains) {
      for (const token of chain.tokens) {
        const priceLogRegex = new RegExp(
          `Current ${token.symbol} price on ${chain.blockchainId}:`
        );
        const foundPriceLog = apiResponse.some((call: [string, ...any[]]) =>
          priceLogRegex.test(call[0])
        );
        expect(foundPriceLog).toBeTruthy();
      }
    }
  });

  it("should return prices within reasonable range for stablecoins", () => {
    const priceRegex = /Current .* price on .*: ([\d.]+)/;
    const prices = apiResponse
      .map((call: [string, ...any[]]) => {
        const match = call[0].match(priceRegex);
        return match ? parseFloat(match[1]) : null;
      })
      .filter((price: unknown): price is number => price !== null);

    prices.forEach((price: number) => {
      expect(price).toBeGreaterThan(0.9);
      expect(price).toBeLessThan(1.1);
    });
  });

  it("should handle API responses with correct data structure", () => {
    // Verify no errors occurred during API calls
    expect(consoleErrorSpy).not.toHaveBeenCalled();

    // Verify we got the expected number of price updates
    const totalTokens = config.chains.reduce(
      (sum, chain) => sum + chain.tokens.length,
      0
    );
    const priceUpdates = apiResponse.filter(
      (call: [string, ...any[]]) =>
        call[0].includes("Current") && call[0].includes("price on")
    );
    expect(priceUpdates.length).toBe(totalTokens);
  });
});
