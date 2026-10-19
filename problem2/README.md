# Problem 2: Fancy Form

Currency swap form built with React, TypeScript, Vite, Tailwind CSS and shadcn/ui.

## Features

- Token prices from the [Switcheo prices API](https://interview.switcheo.com/prices.json)
- Token icons from [Switcheo token-icons](https://github.com/Switcheo/token-icons/tree/main/tokens), with a lettered fallback when an icon is missing
- Type in either "You pay" or "You receive", the other side is calculated from the USD prices
- Token picker with search and keyboard navigation (arrow keys + Enter)
- Switch button to flip the pair
- 25% / 50% / Max shortcuts based on a mock wallet balance
- Exchange rate (click to invert) and minimum received at 0.5% slippage
- Mock swap submission with a loading state and a toast on success

## Validation

- Only digits and one decimal point can be typed (`,` is treated as `.`, max 8 decimals)
- Empty or zero amount: button shows "Enter an amount" and is disabled
- Amount above balance: pay field turns red, button shows "Insufficient ETH balance"
- Picking the same token on both sides flips the pair instead
- If prices fail to load, an error with a "Try again" button is shown

## Setup

```bash
npm install
npm run dev
```

## Scripts

| Command           | Description                    |
| ----------------- | ------------------------------ |
| `npm run dev`     | Start the dev server           |
| `npm run build`   | Type-check and build to `dist` |
| `npm run lint`    | Run ESLint                     |
| `npm run preview` | Preview the production build   |

## Notes

- Some currencies appear more than once in the price feed (e.g. USDC, BUSD). The entry with the latest `date` is used.
- Tokens without a valid price are left out.
- A few icon files use a different casing from the price feed (`STATOM` → `stATOM`, `RATOM` → `rATOM`, ...), these are mapped in `utils/token.ts`.
- Wallet balances are mocked: ETH, USDC, WBTC, ATOM and SWTH have fixed balances, bNEO, GMX, LUNA and ZIL are empty so the insufficient balance case is easy to try, and every other token starts with about $500 worth.
- The price feed is a snapshot from Aug 2023, so prices are only fetched once on load.
- TypeScript is pinned to 6.0 because `typescript-eslint` does not support TypeScript 7 yet.

## Structure

```
src/
├── api/swap.ts              fetch prices, mock swap request
├── hooks/useTokenPrices.ts  loading / error / retry for prices
├── utils/                   token list, formatting, mock balances, validation
├── components/
│   ├── ui/                  shadcn/ui components
│   ├── SwapForm.tsx
│   ├── AmountField.tsx
│   ├── TokenSelect.tsx
│   └── TokenIcon.tsx
├── types.ts
├── App.tsx
└── index.css                Tailwind + theme tokens
```
