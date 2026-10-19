export interface TokenPrice {
  currency: string;
  date: string;
  price: number;
}

export interface Token {
  symbol: string;
  price: number;
  updatedAt: string;
}

export type Balances = Record<string, number>;

export type Side = 'from' | 'to';

export type PricesStatus = 'loading' | 'ready' | 'error';

export interface SwapRequest {
  from: string;
  to: string;
  amountIn: number;
  amountOut: number;
}
