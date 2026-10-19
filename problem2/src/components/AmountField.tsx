import { ChevronDown, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { Token } from '../types';
import { formatToken, formatUsd } from '../utils/format';
import TokenIcon from './TokenIcon';

const FRACTIONS = [
  { label: '25%', value: 0.25 },
  { label: '50%', value: 0.5 },
  { label: 'Max', value: 1 },
];

interface AmountFieldProps {
  id: string;
  label: string;
  value: string;
  token?: Token;
  balance: number;
  invalid?: boolean;
  disabled?: boolean;
  muted?: boolean;
  onChange: (value: string) => void;
  onTokenClick: () => void;
  onFractionClick?: (fraction: number) => void;
}

const AmountField = ({
  id,
  label,
  value,
  token,
  balance,
  invalid,
  disabled,
  muted,
  onChange,
  onTokenClick,
  onFractionClick,
}: AmountFieldProps) => {
  const amount = Number(value) || 0;
  const usdValue = token ? amount * token.price : 0;

  return (
    <div
      className={cn(
        'rounded-2xl border p-4 text-card-foreground transition-colors focus-within:border-muted-foreground',
        muted ? 'border-transparent bg-secondary' : 'bg-surface',
        invalid && 'border-destructive bg-destructive-soft focus-within:border-destructive',
      )}
    >
      <div className="flex min-h-7 items-center justify-between">
        <label htmlFor={id} className="text-sm font-medium text-ink-soft">
          {label}
        </label>

        {onFractionClick && balance > 0 && (
          <div className="flex gap-1">
            {FRACTIONS.map((fraction) => (
              <Button
                key={fraction.label}
                type="button"
                variant="secondary"
                size="sm"
                disabled={disabled}
                onClick={() => onFractionClick(fraction.value)}
                className="h-7 rounded-full px-2.5 text-xs font-semibold text-ink-soft shadow-none hover:bg-highlight hover:text-card-foreground"
              >
                {fraction.label}
              </Button>
            ))}
          </div>
        )}
      </div>

      <div className="my-1 flex items-center gap-3">
        <Input
          id={id}
          inputMode="decimal"
          autoComplete="off"
          placeholder="0"
          value={value}
          disabled={disabled}
          aria-invalid={invalid}
          onChange={(e) => onChange(e.target.value)}
          className="h-auto flex-1 border-0 bg-transparent p-0 font-display text-3xl font-semibold tracking-tight shadow-none placeholder:text-placeholder focus-visible:ring-0 disabled:opacity-100 aria-invalid:text-destructive aria-invalid:ring-0 sm:text-4xl md:text-4xl"
        />

        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          onClick={onTokenClick}
          className={cn(
            'h-11 rounded-full pr-3 pl-2 text-base font-semibold shadow-none has-[>svg]:pl-2 hover:border-card-foreground',
            muted ? 'border-transparent bg-surface hover:bg-surface' : 'bg-card hover:bg-card',
          )}
        >
          {token ? (
            <>
              <TokenIcon symbol={token.symbol} size={26} />
              {token.symbol}
            </>
          ) : (
            'Select token'
          )}
          <ChevronDown className="text-card-foreground" />
        </Button>
      </div>

      <div className="flex justify-between text-sm text-muted-foreground">
        <span>{amount > 0 && formatUsd(usdValue)}</span>

        {token && (
          <span
            className={cn('flex items-center gap-1.5', invalid && 'font-semibold text-destructive')}
          >
            <Wallet className="size-3.5" />
            {formatToken(balance)} {token.symbol}
          </span>
        )}
      </div>
    </div>
  );
};

export default AmountField;
