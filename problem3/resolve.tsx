const UNKNOWN_PRIORITY = -99;

/*
 * #1 Problem: blockchain not defined in WalletBalance
 */
interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
  decimalPlaces: number;
}

/*
 * #1 Problem: WalletBalance and FormattedWalletBalance have some common properties, should inherit it
 */
interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

/*
 * #1 Nit-pick: Should consider remove this one, as it extends but no properties defined, otherwise if want to keep consistent between components implementation, it still fine
 */
interface Props extends BoxProps {}

/*
 * #1 Problem: blockchain type should be string, avoid using any
 * #2 Problem: getPriority lived inside WalletPage and it recreated every render -> should remove it outside WalletPage scope
 * #3 Problem: Zilliqa & Neo have same value, may lead to different order when reload -> should define different priority, otherwise should define sub condition when it equals
 *
 * Important note for recommend structure changes
 * #4 Problem: getPriority use pure naming, different network may have same name (ex: Ethereum) or if backend return different naming (ex: Ethereum Mainnet) -> should define another criteria for priority (chainId + networkId)
 * #5 Problem: priority of blockchain define in FE source code make no sense because if every time we deploy new blockchain, we need to update FE source for the priority, build it, deploy it,...
 * -> should define priority in the WalletBalance and return it from backend, or call api to get the priority list
 */
const getPriority = (blockchain: string): number => {
  switch (blockchain) {
    case "Osmosis":
      return 100;
    case "Ethereum":
      return 50;
    case "Arbitrum":
      return 30;
    case "Zilliqa":
    case "Neo":
      return 20;
    default:
      return UNKNOWN_PRIORITY;
  }
};

/*
 * #1 Problem: WalletPage was defined but not exported to be use
 * #2 Nit-pick: (props: Props) is unnesarry to define, because React.FC<Props> already define Props type
 */
const WalletPage: React.FC<Props> = (props) => {
  /*
   * #1 Nit-pick: children was destructured but not used -> remove it or use underscore
   */
  const { ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  /*
   * #1 Problem: lhsPriority not defined -> should use balancePriority instead
   * #2 Problem: prices was defined as a dependency in useMemo, but it not used in useMemo -> should remove it
   * #3 Problem: getPriority dupplicated handle inside logic of sort -> Should handle it before do any looping
   * #4 Problem: filter condition was inverted, `balance.amount <= 0` kept empty/negative balances and dropped the ones that have funds -> keep `balance.amount > 0` instead
   * #5 Problem: sort returns undefined when priorities are equal -> unstable order -> return `rhs.priority - lhs.priority`, tie-break by currency
   * #6 Nit-pick: -99 is a magic number used in both getPriority and filter -> extract it to a constant (ex: UNKNOWN_PRIORITY)
   */
  const sortedBalances: FormattedWalletBalance = useMemo(() => {
    return balances
      .map((balance) => ({ ...balance, priority: getPriority(balance.blockchain) }))
      .filter((balance) => balance.priority > UNKNOWN_PRIORITY && balance.amount > 0)
      .sort((lhs, rhs) => {
        if (rhs.priority !== lhs.priority) {
          return rhs.priority - lhs.priority;
        }
        return lhs.currency.localeCompare(rhs.currency);
      });
  }, [balances]);

  /*
   * #1 Problem: formattedBalances defined, but not used
   * #2 Problem: toFixed() with no args defaults to 0 decimals, also every blockchain have different decimals place displaying -> should define decimal places in blockchain type and use it dynamically
   * #3 Problem: formattedBalances & row not memo yet -> can combine it together cuz formattedBalances not used anywhere
   * #4 Problem: use index as key is not stable due to the list order may changes -> define key more unique: `${balance.blockchain}-${balance.currency}`
   * #5 Problem: price may be missing -> usdValue becomes NaN -> fallback: `(prices[balance.currency] ?? 0)`
   */
  const rows = useMemo(() => {
    return sortedBalances.map((balance: WalletBalance) => {
      const formatted = balance.amount.toFixed(balance.decimalPlaces);
      const usdValue = (prices[balance.currency] ?? 0) * balance.amount;

      return (
        <WalletRow
          className={classes.row}
          key={`${balance.blockchain}-${balance.currency}`}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={formatted}
        />
      );
    });
  }, [sortedBalances, prices]);

  /*
   * #1 Problem: spread rest from BoxProps to div would cause warning due to some properties not included in HTML div DOM -> assume BoxProps is for MUI Box, should replace div to Box
   */
  return <Box {...rest}>{rows}</Box>;
};

export default WalletPage;
