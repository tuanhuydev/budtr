import { TextFieldProps } from '@mui/material';
import {
  Controller,
  Control,
  FieldValues,
  Path,
  RegisterOptions,
} from 'react-hook-form';

import { AmountInput } from '@/components/AmountInput';

type FormAmountInputProps<T extends FieldValues> = Omit<
  TextFieldProps,
  'name' | 'value' | 'onChange' | 'onBlur'
> & {
  name: Path<T>;
  control: Control<T>;
  rules?: RegisterOptions<T, Path<T>>;
};

export const FormAmountInput = <T extends FieldValues>({
  name,
  control,
  rules,
  helperText,
  ...rest
}: FormAmountInputProps<T>) => (
  <Controller
    name={name}
    control={control}
    rules={rules}
    render={({ field, fieldState }) => (
      <AmountInput
        {...rest}
        value={field.value ?? ''}
        onChange={e => field.onChange(e.target.value)}
        onBlur={field.onBlur}
        error={!!fieldState.error}
        helperText={fieldState.error?.message ?? helperText}
      />
    )}
  />
);
