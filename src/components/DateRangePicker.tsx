import { Box, TextField, SxProps } from '@mui/material';
import { grey } from '@mui/material/colors';
import { useCallback, useState } from 'react';

import { useBudtrTranslation } from '../hooks/useI18n';

export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (dateRange: DateRange) => void;
  sx?: SxProps;
}

export const DateRangePicker = ({
  value,
  onChange,
  sx,
}: DateRangePickerProps) => {
  const { t } = useBudtrTranslation();
  const [internalValue, setInternalValue] = useState<DateRange>({
    startDate: null,
    endDate: null,
  });

  const dateRange = value ?? internalValue;

  const handleStartDateChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newDate = event.target.value ? new Date(event.target.value) : null;
      const newRange = { ...dateRange, startDate: newDate };
      if (!value) {
        setInternalValue(newRange);
      }
      onChange?.(newRange);
    },
    [dateRange, onChange, value]
  );

  const handleEndDateChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newDate = event.target.value ? new Date(event.target.value) : null;
      const newRange = { ...dateRange, endDate: newDate };

      if (!value) {
        setInternalValue(newRange);
      }
      onChange?.(newRange);
    },
    [dateRange, onChange, value]
  );

  const formatDateForInput = useCallback((date: Date | null) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  // #region Variables
  const containerSx: SxProps = {
    ...sx,
    display: 'flex',
    gap: 1,
    alignItems: 'center',
  };

  const inputSx: SxProps = {
    flex: 1,
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'white',
    },
  };

  return (
    <Box sx={containerSx}>
      <TextField
        type='date'
        label={t('common.startDate')}
        value={formatDateForInput(dateRange.startDate)}
        onChange={handleStartDateChange}
        slotProps={{
          inputLabel: {
            shrink: true,
          },
        }}
        sx={inputSx}
      />
      <Box sx={{ color: grey[500] }}>—</Box>
      <TextField
        type='date'
        label={t('common.endDate')}
        value={formatDateForInput(dateRange.endDate)}
        onChange={handleEndDateChange}
        slotProps={{
          inputLabel: {
            shrink: true,
          },
          htmlInput: {
            min: formatDateForInput(dateRange.startDate),
          },
        }}
        sx={inputSx}
      />
    </Box>
  );
};
