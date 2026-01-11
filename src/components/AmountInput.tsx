import { TextField, TextFieldProps } from '@mui/material';
import { ChangeEvent, useState, useEffect } from 'react';

/**
 * Formats a numeric string by removing leading zeros and adding commas as thousand separators.
 *
 * @param val - The input string representing a number.
 * @returns The formatted string with commas as thousand separators, or an empty string if the input is falsy.
 *
 * @example
 * formatAmount("0123456"); // "1,234,56"
 * formatAmount("1000000"); // "1,000,000"
 */
function formatAmount(val: string) {
  if (!val) return '';
  // Remove leading 0
  const num = val.replace(/^0+(?!$)/, '');
  // for each 3 number digit follwing with number then replace it with comma,
  return num.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export const AmountInput = (props?: TextFieldProps) => {
  const { value = '', onChange, ...rest } = props || {};

  const [displayValue, setDisplayValue] = useState<string>(
    formatAmount(String(value))
  );

  // Only allow number
  function sanitize(val: string) {
    return val.replace(/[^0-9]/g, '');
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = sanitize(e.target.value);
    const formatted = formatAmount(raw);
    setDisplayValue(formatted);

    if (onChange) {
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: raw,
        },
      };
      onChange(syntheticEvent as ChangeEvent<HTMLInputElement>);
    }
  };

  useEffect(() => {
    setDisplayValue(formatAmount(String(value)));
  }, [value]);

  return (
    <TextField
      {...rest}
      onChange={handleChange}
      placeholder='Amount'
      value={displayValue}
      slotProps={{
        ...props?.slotProps,
        htmlInput: {
          inputMode: 'numeric',
          pattern: '[0-9]*',
        },
      }}
    />
  );
};
