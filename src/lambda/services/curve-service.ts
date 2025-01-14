import axios from "axios";

export interface TokenPrice {
  symbol: string;
  price: number;
  blockchainId: string;
}

interface CurveApiResponse {
  data: {
    address: string;
    usd_price: number;
    last_updated: string;
  };
}

export class CurveService {
  private readonly baseUrl: string;
  private readonly blockchainId: string;

  constructor(blockchainId: string) {
    this.blockchainId = blockchainId;
    this.baseUrl = `https://prices.curve.fi/v1/usd_price/${blockchainId}`;
  }

  async getTokenPrice(symbol: string, address: string): Promise<TokenPrice> {
    const url = `${this.baseUrl}/${address}`;
    console.log(`Making request to: ${url}`);

    try {
      const response = await axios.get<CurveApiResponse>(url);
      console.log(`Response data:`, response.data);

      const price = response.data?.data?.usd_price;

      if (price === undefined || price === null) {
        throw new Error(
          `Price not found for token ${symbol} (${address}) on chain ${this.blockchainId}`
        );
      }

      return {
        symbol,
        price: Number(price),
        blockchainId: this.blockchainId,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(`API Error details:`, {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
        });
      }
      if (error instanceof Error) {
        throw new Error(
          `Failed to fetch token price on chain ${this.blockchainId}: ${error.message}`
        );
      }
      throw error;
    }
  }
}
