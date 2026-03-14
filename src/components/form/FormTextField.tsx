import { TextField, TextFieldProps } from '@mui/material';
import {
  Controller,
  FieldValues,
  Path,
  Control,
  RegisterOptions,
} from 'react-hook-form';

type FormTextFieldProps<T extends FieldValues> = Omit<
  TextFieldProps,
  'name' | 'value' | 'onChange' | 'onBlur'
> & {
  name: Path<T>;
  control: Control<T>;
  rules?: RegisterOptions<T, Path<T>>;
};

export const FormTextField = <T extends FieldValues>({
  name,
  control,
  rules,
  helperText,
  ...rest
}: FormTextFieldProps<T>) => (
  <Controller
    name={name}
    control={control}
    rules={rules}
    render={({ field, fieldState }) => (
      <TextField
        {...rest}
        {...field}
        error={!!fieldState.error}
        helperText={fieldState.error?.message ?? helperText}
      />
    )}
  />
);
