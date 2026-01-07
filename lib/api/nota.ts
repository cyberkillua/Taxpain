/**
 * NOTA API Client
 * Handles all API requests to the NOTA tax calculation service
 * Includes retry logic, caching, and fallback handling
 */

import type {
  PITRequest,
  PITResponse,
  CITRequest,
  CITResponse,
  CGTRequest,
  CGTResponse,
  TaxableIncomeRequest,
  TaxableIncomeResponse,
} from "@/types/nota";
import { requestCache } from "./cache";

// Use Next.js API route as proxy to avoid CORS issues
const BASE_URL = "/api/nota";
const REQUEST_TIMEOUT = 10000; // 10 seconds
const MAX_RETRIES = 2;

interface RequestOptions {
  retries?: number;
  useCache?: boolean;
}

class NOTAClient {
  private baseURL: string;

  constructor(baseURL: string = BASE_URL) {
    this.baseURL = baseURL;
  }

  /**
   * Generic request method with retry logic
   */
  private async request<T>(
    endpoint: string,
    body: unknown,
    options: RequestOptions = {}
  ): Promise<T> {
    const { retries = MAX_RETRIES, useCache = true } = options;
    const cacheKey = requestCache.getKey(endpoint, body);

    // Check cache first
    if (useCache) {
      const cached = requestCache.get<T>(cacheKey);
      if (cached !== null) {
        return cached;
      }
    }

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

        const response = await fetch(`${this.baseURL}${endpoint}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `API error (${response.status}): ${errorText || response.statusText}`
          );
        }

        const data = await response.json();

        // Cache successful response
        if (useCache) {
          requestCache.set(cacheKey, data);
        }

        return data as T;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        // Don't retry on 4xx errors (client errors)
        if (
          error instanceof Error &&
          error.message.includes("API error (4")
        ) {
          throw error;
        }

        // Retry with exponential backoff
        if (attempt < retries) {
          const delay = Math.pow(2, attempt) * 1000; // 1s, 2s
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }
      }
    }

    throw lastError || new Error("Request failed after retries");
  }

  /**
   * Calculate Personal Income Tax
   */
  async calculatePIT(request: PITRequest): Promise<PITResponse> {
    return this.request<PITResponse>("/tax/pit/calculate", request);
  }

  /**
   * Calculate Companies Income Tax
   */
  async calculateCIT(request: CITRequest): Promise<CITResponse> {
    return this.request<CITResponse>("/tax/cit/calculate", request);
  }

  /**
   * Calculate Capital Gains Tax
   */
  async calculateCGT(request: CGTRequest): Promise<CGTResponse> {
    return this.request<CGTResponse>("/tax/cgt/calculate", request);
  }

  /**
   * Calculate Taxable Income
   */
  async calculateTaxableIncome(
    request: TaxableIncomeRequest
  ): Promise<TaxableIncomeResponse> {
    return this.request<TaxableIncomeResponse>(
      "/tax/taxable-income",
      request
    );
  }
}

// Singleton instance
export const notaClient = new NOTAClient();

// Export for testing
export { NOTAClient };

