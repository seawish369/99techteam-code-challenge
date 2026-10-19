const MAX_DECIMALS = 8;

export const sanitizeAmount = (value: string) => {
  let result = value.replace(/,/g, '.').replace(/[^\d.]/g, '');

  const dot = result.indexOf('.');
  if (dot !== -1) {
    const whole = result.slice(0, dot);
    const fraction = result
      .slice(dot + 1)
      .replace(/\./g, '')
      .slice(0, MAX_DECIMALS);
    result = `${whole}.${fraction}`;
  }

  if (result.startsWith('.')) {
    result = `0${result}`;
  }

  return result.replace(/^0+(?=\d)/, '');
};

export const toInputValue = (value: number) => {
  if (!Number.isFinite(value) || value <= 0) {
    return '';
  }

  let decimals = MAX_DECIMALS;
  if (value >= 1000) {
    decimals = 2;
  } else if (value >= 1) {
    decimals = 4;
  } else if (value >= 0.01) {
    decimals = 6;
  }

  return value.toFixed(decimals).replace(/\.?0+$/, '');
};

export const formatToken = (value: number) => {
  const abs = Math.abs(value);
  if (abs === 0) {
    return '0';
  }

  if (abs < 0.001) {
    return value.toLocaleString('en-US', { maximumSignificantDigits: 4 });
  }

  let decimals = 2;
  if (abs < 1) {
    decimals = 6;
  } else if (abs < 1000) {
    decimals = 4;
  }

  return value.toLocaleString('en-US', { maximumFractionDigits: decimals });
};

export const formatUsd = (value: number) => {
  if (value > 0 && value < 0.01) {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumSignificantDigits: 3,
    });
  }

  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};
