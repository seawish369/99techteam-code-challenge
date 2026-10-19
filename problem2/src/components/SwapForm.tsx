import { useState, type FormEvent } from 'react';
import { ArrowDownUp, ArrowLeftRight, LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { submitSwap } from '../api/swap';
import type { Side, Token } from '../types';
import { createMockBalances, roundBalance } from '../utils/balances';
import { formatToken, formatUsd, sanitizeAmount, toInputValue } from '../utils/format';
import { findToken, getRate } from '../utils/token';
import { getSwapError } from '../utils/validation';
import AmountField from './AmountField';
import TokenSelect from './TokenSelect';

const SLIPPAGE = 0.005;

interface SwapFormProps {
  tokens: Token[];
}

const SwapForm = ({ tokens }: SwapFormProps) => {
  const [fromSymbol, setFromSymbol] = useState('ETH');
  const [toSymbol, setToSymbol] = useState('USDC');
  const [amount, setAmount] = useState('');
  const [editingSide, setEditingSide] = useState<Side>('from');
  const [balances, setBalances] = useState(() => createMockBalances(tokens));
  const [submitting, setSubmitting] = useState(false);
  const [pickerSide, setPickerSide] = useState<Side | null>(null);
  const [showInverseRate, setShowInverseRate] = useState(false);
  const [flipCount, setFlipCount] = useState(0);

  const fromToken = findToken(tokens, fromSymbol);
  const toToken = findToken(tokens, toSymbol);
  const rate = getRate(fromToken, toToken);

  let fromValue = amount;
  let toValue = amount;
  if (editingSide === 'from') {
    toValue = toInputValue(Number(amount) * rate);
  } else {
    fromValue = toInputValue(Number(amount) / rate);
  }

  const fromAmount = Number(fromValue) || 0;
  const toAmount = Number(toValue) || 0;
  const fromBalance = balances[fromSymbol] ?? 0;
  const toBalance = balances[toSymbol] ?? 0;

  const error = getSwapError(fromAmount, fromBalance, fromSymbol);
  const isOverBalance = fromAmount > fromBalance;

  const handleAmountChange = (side: Side, value: string) => {
    setEditingSide(side);
    setAmount(sanitizeAmount(value));
  };

  const handleFractionClick = (fraction: number) => {
    setEditingSide('from');
    setAmount(fraction === 1 ? String(fromBalance) : toInputValue(fromBalance * fraction));
  };

  const handleFlip = () => {
    setFromSymbol(toSymbol);
    setToSymbol(fromSymbol);
    setEditingSide(editingSide === 'from' ? 'to' : 'from');
    setFlipCount(flipCount + 1);
  };

  const handleTokenSelect = (symbol: string) => {
    if (pickerSide === 'from') {
      if (symbol === toSymbol) {
        handleFlip();
      } else {
        setFromSymbol(symbol);
      }
    }

    if (pickerSide === 'to') {
      if (symbol === fromSymbol) {
        handleFlip();
      } else {
        setToSymbol(symbol);
      }
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (error || submitting) {
      return;
    }

    setSubmitting(true);

    try {
      await submitSwap({
        from: fromSymbol,
        to: toSymbol,
        amountIn: fromAmount,
        amountOut: toAmount,
      });

      setBalances((prev) => ({
        ...prev,
        [fromSymbol]: roundBalance(prev[fromSymbol] - fromAmount),
        [toSymbol]: roundBalance((prev[toSymbol] ?? 0) + toAmount),
      }));
      setAmount('');
      toast.success('Swap complete', {
        description: `Swapped ${formatToken(fromAmount)} ${fromSymbol} for ${formatToken(toAmount)} ${toSymbol}`,
      });
    } catch {
      toast.error('Swap failed, please try again');
    } finally {
      setSubmitting(false);
    }
  };

  let buttonLabel = error ?? `Swap ${fromSymbol} for ${toSymbol}`;
  if (submitting) {
    buttonLabel = 'Swapping...';
  }

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
      <div className="relative flex flex-col gap-1.5">
        <AmountField
          id="pay-amount"
          label="You pay"
          value={fromValue}
          token={fromToken}
          balance={fromBalance}
          invalid={isOverBalance}
          disabled={submitting}
          onChange={(value) => handleAmountChange('from', value)}
          onTokenClick={() => setPickerSide('from')}
          onFractionClick={handleFractionClick}
        />

        <Button
          type="button"
          size="icon"
          disabled={submitting}
          onClick={handleFlip}
          aria-label="Switch tokens"
          style={{ rotate: `${flipCount * 180}deg` }}
          className="absolute top-1/2 left-1/2 z-10 size-11 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-card bg-highlight text-card-foreground shadow-none transition-all duration-300 hover:bg-highlight-strong"
        >
          <ArrowDownUp className="size-5" />
        </Button>

        <AmountField
          id="receive-amount"
          label="You receive"
          value={toValue}
          token={toToken}
          balance={toBalance}
          disabled={submitting}
          muted
          onChange={(value) => handleAmountChange('to', value)}
          onTokenClick={() => setPickerSide('to')}
        />
      </div>

      {fromToken && toToken && (
        <div className="flex items-center justify-between px-1.5 text-sm text-card-foreground">
          <button
            type="button"
            onClick={() => setShowInverseRate(!showInverseRate)}
            className="flex items-center gap-1.5 font-semibold"
          >
            {showInverseRate
              ? `1 ${toSymbol} = ${formatToken(1 / rate)} ${fromSymbol}`
              : `1 ${fromSymbol} = ${formatToken(rate)} ${toSymbol}`}
            <ArrowLeftRight className="size-3.5 text-muted-foreground" />
          </button>
          <span className="text-muted-foreground">
            {formatUsd(showInverseRate ? toToken.price : fromToken.price)}
          </span>
        </div>
      )}

      {fromAmount > 0 && (
        <dl className="grid gap-1.5 rounded-xl border border-dashed px-3.5 py-2.5 text-sm text-card-foreground">
          <div className="flex justify-between">
            <dt className="text-ink-soft">Minimum received</dt>
            <dd className="font-semibold">
              {formatToken(toAmount * (1 - SLIPPAGE))} {toSymbol}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-soft">Slippage tolerance</dt>
            <dd className="font-semibold">{SLIPPAGE * 100}%</dd>
          </div>
        </dl>
      )}

      <Button
        type="submit"
        disabled={!!error || submitting}
        className={cn(
          'h-14 w-full rounded-2xl font-display text-lg font-semibold disabled:opacity-100',
          submitting && 'disabled:bg-primary disabled:text-primary-foreground',
          !submitting && isOverBalance && 'disabled:bg-destructive-soft disabled:text-destructive',
          !submitting && !isOverBalance && 'disabled:bg-disabled disabled:text-ink-soft',
        )}
      >
        {submitting && <LoaderCircle className="size-5 animate-spin text-highlight" />}
        {buttonLabel}
      </Button>

      <TokenSelect
        open={pickerSide !== null}
        tokens={tokens}
        balances={balances}
        selected={pickerSide === 'to' ? toSymbol : fromSymbol}
        onSelect={handleTokenSelect}
        onClose={() => setPickerSide(null)}
      />
    </form>
  );
};

export default SwapForm;
