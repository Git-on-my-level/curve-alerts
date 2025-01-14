import { ScheduledEvent } from "aws-lambda";
import { CurveService } from "./services/curve-service";
import { PriceChecker } from "./services/price-checker";
import { NotificationService } from "./services/notification-service";
import { config } from "./config";

export const handler = async (
  event: ScheduledEvent
): Promise<{ statusCode: number; body: string }> => {
  console.log("Event:", JSON.stringify(event, null, 2));

  const notificationService = new NotificationService(config.slackWebhookUrl);

  for (const chain of config.chains) {
    const curveService = new CurveService(chain.blockchainId);

    for (const token of chain.tokens) {
      try {
        const tokenPrice = await curveService.getTokenPrice(
          token.symbol,
          token.address
        );
        console.log(
          `Current ${token.symbol} price on ${chain.blockchainId}: ${tokenPrice.price}`
        );

        const priceChecker = new PriceChecker(token.threshold);
        const alert = priceChecker.checkPrice(tokenPrice);

        if (alert) {
          await notificationService.sendAlert(alert);
        }
      } catch (error) {
        console.error(
          `Error checking price for ${token.symbol} on ${chain.blockchainId}:`,
          error
        );
      }
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Success" }),
  };
};
