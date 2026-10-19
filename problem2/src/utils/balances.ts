import type { Balances, Token } from '../types';

const STARTING_BALANCES: Balances = {
  ETH: 1.25,
  USDC: 2500,
  WBTC: 0.042,
  ATOM: 180,
  SWTH: 250000,
};

const EMPTY_TOKENS = ['bNEO', 'GMX', 'LUNA', 'ZIL'];

const DEFAULT_USD_VALUE = 500;

export const createMockBalances = (tokens: Token[]): Balances => {
  const balances: Balances = {};

  for (const token of tokens) {
    if (token.symbol in STARTING_BALANCES) {
      balances[token.symbol] = STARTING_BALANCES[token.symbol];
      continue;
    }

    if (EMPTY_TOKENS.includes(token.symbol)) {
      balances[token.symbol] = 0;
      continue;
    }

    balances[token.symbol] = Number((DEFAULT_USD_VALUE / token.price).toPrecision(6));
  }

  return balances;
};

export const roundBalance = (value: number) => {
  return Math.max(0, Number(value.toFixed(8)));
};
