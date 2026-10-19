export const getSwapError = (amount: number, balance: number, symbol: string): string | null => {
  if (!amount || amount <= 0) {
    return 'Enter an amount';
  }

  if (amount > balance) {
    return `Insufficient ${symbol} balance`;
  }

  return null;
};
