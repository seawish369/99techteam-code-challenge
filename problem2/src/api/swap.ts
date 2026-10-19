import type { SwapRequest, TokenPrice } from '../types';

const PRICES_URL = 'https://interview.switcheo.com/prices.json';
const SWAP_DELAY_MS = 1800;

export const fetchPrices = async (): Promise<TokenPrice[]> => {
  const res = await fetch(PRICES_URL);

  if (!res.ok) {
    throw new Error('Failed to fetch prices');
  }

  return res.json();
};

export const submitSwap = (request: SwapRequest): Promise<SwapRequest> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(request);
    }, SWAP_DELAY_MS);
  });
};
