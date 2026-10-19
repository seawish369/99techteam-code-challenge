/**
 * sum_to_n_a — Gauss formula
 * Time: O(1) | Space: O(1)
 * Pros: Fastest, constant time regardless of n.
 * Cons: Intermediate n * (n + 1) can exceed MAX_SAFE_INTEGER even when the
 *       final result doesn't. Returns non-zero for negative n (e.g. -5 → 10).
 */
var sum_to_n_a = function (n) {
  return (n * (n + 1)) / 2;
};

/**
 * sum_to_n_b — Iterative loop
 * Time: O(n) | Space: O(1)
 * Pros: Simple, easy to read and verify; no overflow in intermediate steps;
 *       naturally returns 0 for n <= 0.
 * Cons: Slower than the formula for large n.
 */
var sum_to_n_b = function (n) {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
};

/**
 * sum_to_n_c — Recursion
 * Time: O(n) | Space: O(n) (call stack)
 * Pros: Concise, mirrors the mathematical definition sum(n) = n + sum(n - 1).
 * Cons: Each call adds a stack frame → "Maximum call stack size exceeded"
 *       for large n (roughly ~10,000+ depending on the JS engine).
 *       Slowest of the three due to function call overhead.
 */
var sum_to_n_c = function (n) {
  if (n <= 0) return 0;
  return n + sum_to_n_c(n - 1);
};
