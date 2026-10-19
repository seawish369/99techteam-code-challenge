import type { Token, TokenPrice } from '../types';

const ICON_BASE_URL = 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens';

const ICON_NAMES: Record<string, string> = {
  RATOM: 'rATOM',
  STATOM: 'stATOM',
  STEVMOS: 'stEVMOS',
  STLUNA: 'stLUNA',
  STOSMO: 'stOSMO',
};

export const getTokenIconUrl = (symbol: string) => {
  const name = ICON_NAMES[symbol] ?? symbol;
  return `${ICON_BASE_URL}/${name}.svg`;
};

export const toTokenList = (prices: TokenPrice[]): Token[] => {
  const latest = new Map<string, TokenPrice>();

  for (const item of prices) {
    if (!item?.currency || typeof item.price !== 'number' || item.price <= 0) {
      continue;
    }

    const current = latest.get(item.currency);
    if (!current || Date.parse(item.date) >= Date.parse(current.date)) {
      latest.set(item.currency, item);
    }
  }

  return Array.from(latest.values())
    .map((item) => ({ symbol: item.currency, price: item.price, updatedAt: item.date }))
    .sort((a, b) => a.symbol.localeCompare(b.symbol, 'en', { sensitivity: 'base' }));
};

export const findToken = (tokens: Token[], symbol: string) => {
  return tokens.find((token) => token.symbol === symbol);
};

export const getRate = (from?: Token, to?: Token) => {
  if (!from || !to) {
    return 0;
  }

  return from.price / to.price;
};
