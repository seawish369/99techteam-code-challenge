import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Toaster } from '@/components/ui/sonner';
import SwapForm from './components/SwapForm';
import { useTokenPrices } from './hooks/useTokenPrices';

const App = () => {
  const { tokens, status, retry } = useTokenPrices();

  return (
    <main className="flex min-h-screen flex-col items-center gap-5 px-4 py-6 sm:justify-center">
      <section className="w-full max-w-md rounded-3xl bg-card p-3 text-card-foreground shadow-2xl sm:p-5">
        <header className="flex items-baseline justify-between px-1.5 pb-4">
          <h1 className="font-display text-3xl font-bold tracking-tight">Swap</h1>
          {status === 'ready' && (
            <span className="text-sm text-muted-foreground">{tokens.length} tokens</span>
          )}
        </header>

        {status === 'loading' && (
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-32 rounded-2xl bg-secondary" />
            <Skeleton className="h-32 rounded-2xl bg-secondary" />
            <Skeleton className="mt-3 h-14 rounded-2xl bg-secondary" />
          </div>
        )}

        {status === 'error' && (
          <div className="grid gap-4 px-1.5 text-ink-soft">
            <p>Couldn't load token prices. Please check your connection and try again.</p>
            <Button
              onClick={retry}
              className="h-12 rounded-2xl font-display text-base font-semibold"
            >
              Try again
            </Button>
          </div>
        )}

        {status === 'ready' && <SwapForm tokens={tokens} />}
      </section>

      <Toaster
        position="bottom-center"
        toastOptions={{ classNames: { icon: 'text-highlight-strong' } }}
      />
    </main>
  );
};

export default App;
