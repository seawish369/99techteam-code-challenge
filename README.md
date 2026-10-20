# 99Tech Code Challenge

Solutions for the three problems of the 99Tech frontend code challenge.

| Problem | Folder | What it is |
| --- | --- | --- |
| 1. Three ways to sum to n | [`problem1`](./problem1) | Three implementations of `sum_to_n` in JavaScript |
| 2. Fancy Form | [`problem2`](./problem2) | Currency swap form built with Vite, React, TypeScript, Tailwind CSS and shadcn/ui |
| 3. Messy React | [`problem3`](./problem3) | Code review of a React component: issues found and a refactored version |

---

## Problem 1: Three ways to sum to n

File: [`problem1/solutions.js`](./problem1/solutions.js)

| Function | Approach | Time | Space |
| --- | --- | --- | --- |
| `sum_to_n_a` | Gauss formula `n * (n + 1) / 2` | O(1) | O(1) |
| `sum_to_n_b` | Iterative loop | O(n) | O(1) |
| `sum_to_n_c` | Recursion `n + sum(n - 1)` | O(n) | O(n) call stack |

Pros and cons of each approach are written above each function.

Assumption: the task expects a positive `n`. For `n <= 0`, `sum_to_n_b` and `sum_to_n_c` return `0` (empty sum), while the formula in `sum_to_n_a` is applied as-is.

Quick check in a terminal:

```bash
node -e "eval(require('fs').readFileSync('problem1/solutions.js', 'utf8')); console.log(sum_to_n_a(5), sum_to_n_b(5), sum_to_n_c(5))"
# 15 15 15
```

---

## Problem 2: Fancy Form

Folder: [`problem2`](./problem2) — more details in [`problem2/README.md`](./problem2/README.md).

A currency swap form: pick two tokens, type an amount on either side and the other side is calculated from live USD prices. Balances and the swap request are mocked.

### Requirements

- Node.js **20.19+** or **22.12+** (required by Vite 8)
- npm
- Internet access when running the app (token prices and icons are loaded from Switcheo)

### Run it

```bash
cd problem2
npm install
npm run dev
```

Then open http://localhost:5173.

Other commands:

| Command | Description |
| --- | --- |
| `npm run build` | Type-check and build to `problem2/dist` |
| `npm run preview` | Serve the production build at http://localhost:4173 |
| `npm run lint` | Run ESLint |

### Features

- Token prices from the [Switcheo prices API](https://interview.switcheo.com/prices.json), duplicated currencies are resolved by the latest `date`, tokens without a price are skipped
- Token icons from [Switcheo token-icons](https://github.com/Switcheo/token-icons/tree/main/tokens), with a fallback when an icon is missing
- Two-way amount input ("You pay" or "You receive")
- Token picker with search and keyboard navigation (arrow keys + Enter)
- Switch button to flip the pair, 25% / 50% / Max shortcuts, exchange rate (click to invert), minimum received at 0.5% slippage
- Validation: only valid numbers can be typed, the submit button explains what is blocking the swap ("Enter an amount", "Insufficient ETH balance")
- Mock submit with a loading state and a success toast
- Loading skeleton and a "Try again" state when prices fail to load

### Tech stack

Vite 8, React 19, TypeScript 6, Tailwind CSS v4, shadcn/ui (Radix UI + cmdk), sonner, lucide-react.

TypeScript is pinned to 6.0 because `typescript-eslint` does not support TypeScript 7 yet.

### Troubleshooting

| Error | Fix |
| --- | --- |
| `sh: vite: command not found` | Run `npm install` inside `problem2` first |
| `Cannot find native binding` | `node_modules` was installed on another OS: `rm -rf node_modules && npm install` |
| Token list stays on the loading skeleton | The prices API is not reachable, check the network tab and use "Try again" |

---

## Problem 3: Messy React

Folder: [`problem3`](./problem3)

| File | Content |
| --- | --- |
| [`problem.tsx`](./problem3/problem.tsx) | The original code from the task |
| [`resolve.tsx`](./problem3/resolve.tsx) | Refactored code, every issue is explained in a comment right above the code it affects |

Main issues found:

- **Logic bugs**
  - `lhsPriority` is not defined (should be `balancePriority`)
  - The filter condition is inverted: it keeps balances `<= 0` and drops the ones with funds
  - The sort comparator returns `undefined` when priorities are equal
  - `formattedBalances` is computed but never used, so `formattedAmount` is always `undefined`
  - Missing prices lead to `NaN` USD values
- **Performance**
  - `prices` is a `useMemo` dependency but is not used inside it, so every price update re-sorts the list
  - `getPriority` is recreated on every render and called repeatedly inside `sort`
  - `formattedBalances` and `rows` are rebuilt on every render
- **TypeScript and React**
  - `WalletBalance` has no `blockchain` field, `getPriority` uses `any`
  - `FormattedWalletBalance` repeats the fields of `WalletBalance`
  - `key={index}` is not stable when the list is filtered or sorted
  - `BoxProps` are spread onto a `<div>`
  - `children` is never rendered, `classes` is not defined, the component is not exported
- **Design**
  - Blockchain priority is matched by display name and hard-coded in the frontend: a renamed or new network needs a code change and a deploy. A stable chain ID, or a priority returned by the backend, would be safer.

Assumptions: `BoxProps` comes from MUI, and `decimalPlaces` was added to `WalletBalance` so each token can be formatted with its own precision.
