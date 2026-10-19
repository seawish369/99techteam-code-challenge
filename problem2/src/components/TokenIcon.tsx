import { useState } from 'react';
import { getTokenIconUrl } from '../utils/token';

interface TokenIconProps {
  symbol: string;
  size?: number;
}

const TokenIcon = ({ symbol, size = 28 }: TokenIconProps) => {
  const [failedSymbol, setFailedSymbol] = useState<string | null>(null);

  if (failedSymbol === symbol) {
    return (
      <span
        className="grid shrink-0 place-items-center rounded-full bg-muted text-xs font-bold text-muted-foreground"
        style={{ width: size, height: size }}
      >
        {symbol.charAt(0).toUpperCase()}
      </span>
    );
  }

  return (
    <img
      src={getTokenIconUrl(symbol)}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      className="shrink-0 rounded-full"
      onError={() => setFailedSymbol(symbol)}
    />
  );
};

export default TokenIcon;
