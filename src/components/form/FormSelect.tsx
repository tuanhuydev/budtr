import { TextField, TextFieldProps } from '@mui/material';
import { ReactNode } from 'react';
import {
  Controller,
  Control,
  FieldValues,
  Path,
  RegisterOptions,
} from 'react-hook-form';

type FormSelectProps<T extends FieldValues> = Omit<
  TextFieldProps,
  'name' | 'value' | 'onChange' | 'onBlur' | 'select' | 'children'
> & {
  name: Path<T>;
  control: Control<T>;
  label: string;
  children: ReactNode;
  rules?: RegisterOptions<T, Path<T>>;
};

export const FormSelect = <T extends FieldValues>({
  name,
  control,
  label,
  children,
  rules,
  helperText,
  ...rest
}: FormSelectProps<T>) => (
  <Controller
    name={name}
    control={control}
    rules={rules}
    render={({ field, fieldState }) => (
      <TextField
        {...rest}
        {...field}
        select
        label={label}
        error={!!fieldState.error}
        helperText={fieldState.error?.message ?? helperText}
      >
        {children}
      </TextField>
    )}
  />
);
