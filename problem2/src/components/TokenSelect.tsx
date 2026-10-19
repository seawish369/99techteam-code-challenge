import { useState } from 'react';
import { CheckIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import type { Balances, Token } from '../types';
import { formatToken, formatUsd } from '../utils/format';
import TokenIcon from './TokenIcon';

const POPULAR_TOKENS = ['ETH', 'USDC', 'WBTC', 'ATOM', 'SWTH', 'OSMO'];

const matchSymbol = (value: string, search: string) => {
  const symbol = value.toLowerCase();
  const query = search.trim().toLowerCase();

  if (symbol.startsWith(query)) {
    return 1;
  }
  if (symbol.includes(query)) {
    return 0.5;
  }
  return 0;
};

interface TokenSelectProps {
  open: boolean;
  tokens: Token[];
  balances: Balances;
  selected?: string;
  onSelect: (symbol: string) => void;
  onClose: () => void;
}

const TokenSelect = ({ open, tokens, balances, selected, onSelect, onClose }: TokenSelectProps) => {
  const [query, setQuery] = useState('');

  const handleSelect = (symbol: string) => {
    onSelect(symbol);
    onClose();
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        onCloseAutoFocus={() => setQuery('')}
        className="flex max-h-[85vh] flex-col gap-0 overflow-hidden rounded-3xl border-0 bg-card p-0 text-card-foreground sm:max-w-md"
      >
        <DialogHeader className="px-5 pt-5 text-left">
          <DialogTitle className="font-display text-xl">Select a token</DialogTitle>
          <DialogDescription className="sr-only">Search tokens by symbol</DialogDescription>
        </DialogHeader>

        <Command filter={matchSymbol} className="min-h-0 flex-1 bg-transparent">
          <CommandInput
            value={query}
            onValueChange={setQuery}
            placeholder="Search by symbol"
            wrapperClassName="mx-4 mt-4 h-12 rounded-xl border bg-surface focus-within:border-card-foreground"
            className="h-full text-base"
          />

          {!query && (
            <div className="flex flex-wrap gap-1.5 px-4 pt-3">
              {POPULAR_TOKENS.map((symbol) => (
                <Button
                  key={symbol}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleSelect(symbol)}
                  className={cn(
                    'h-8 rounded-full bg-surface pl-1.5 font-semibold shadow-none has-[>svg]:pl-1.5 hover:border-card-foreground hover:bg-surface',
                    symbol === selected && 'border-highlight bg-highlight-soft',
                  )}
                >
                  <TokenIcon symbol={symbol} size={20} />
                  {symbol}
                </Button>
              ))}
            </div>
          )}

          <CommandList className="mt-3 max-h-none flex-1 border-t px-2 pt-1 pb-3">
            <CommandEmpty className="py-8 text-center text-ink-soft">No tokens found.</CommandEmpty>

            <CommandGroup className="p-0">
              {tokens.map((token) => {
                const balance = balances[token.symbol] ?? 0;
                const isSelected = token.symbol === selected;

                return (
                  <CommandItem
                    key={token.symbol}
                    value={token.symbol}
                    onSelect={() => handleSelect(token.symbol)}
                    className={cn(
                      'cursor-pointer gap-3 rounded-xl px-3 py-2.5 text-base',
                      isSelected && 'bg-highlight-soft data-[selected=true]:bg-highlight-soft',
                    )}
                  >
                    <TokenIcon symbol={token.symbol} size={36} />

                    <div className="flex-1">
                      <div className="font-semibold">{token.symbol}</div>
                      <div className="text-xs text-muted-foreground">{formatUsd(token.price)}</div>
                    </div>

                    <div className="text-right font-medium">
                      {balance > 0 ? (
                        <>
                          <div>{formatToken(balance)}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatUsd(balance * token.price)}
                          </div>
                        </>
                      ) : (
                        <div className="text-xs text-muted-foreground">No balance</div>
                      )}
                    </div>

                    {isSelected && <CheckIcon className="size-4 text-highlight-strong" />}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
};

export default TokenSelect;
