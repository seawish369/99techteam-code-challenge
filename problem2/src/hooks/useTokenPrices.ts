import { useEffect, useState } from 'react';
import { fetchPrices } from '../api/swap';
import type { PricesStatus, Token } from '../types';
import { toTokenList } from '../utils/token';

export const useTokenPrices = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [status, setStatus] = useState<PricesStatus>('loading');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    fetchPrices()
      .then((prices) => {
        if (cancelled) {
          return;
        }
        setTokens(toTokenList(prices));
        setStatus('ready');
      })
      .catch(() => {
        if (cancelled) {
          return;
        }
        setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, [retryCount]);

  const retry = () => {
    setStatus('loading');
    setRetryCount((count) => count + 1);
  };

  return { tokens, status, retry };
};
