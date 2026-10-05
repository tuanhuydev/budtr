import { Box, Chip, Popover, SxProps } from '@mui/material';
import { useState } from 'react';

import { DateRange, DateRangePicker } from '@/components/DateRangePicker';
import { useBudtrTranslation } from '@/hooks/useI18n';
import { Period } from '@/utils/period';

interface PeriodPillsProps {
  period: Period;
  customRange: DateRange;
  onPeriodChange: (period: Period) => void;
  onCustomRangeChange: (range: DateRange) => void;
}

const OPTIONS: Array<{ value: Period; labelKey: string }> = [
  { value: 'week', labelKey: 'overview.thisWeek' },
  { value: 'month', labelKey: 'overview.thisMonth' },
  { value: 'year', labelKey: 'overview.thisYear' },
  { value: 'custom', labelKey: 'overview.custom' },
];

export const PeriodPills = ({
  period,
  customRange,
  onPeriodChange,
  onCustomRangeChange,
}: PeriodPillsProps) => {
  const { t } = useBudtrTranslation();
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);

  const handleCustomChange = (range: DateRange) => {
    onCustomRangeChange(range);
    if (range.startDate && range.endDate) {
      onPeriodChange('custom');
      setAnchor(null);
    }
  };

  return (
    <Box role='group' aria-label={t('overview.periodLabel')} sx={RootSx}>
      {OPTIONS.map(option => {
        const active = period === option.value;
        return (
          <Chip
            key={option.value}
            component='button'
            size='small'
            clickable
            aria-pressed={active}
            label={t(option.labelKey)}
            variant={active ? 'filled' : 'outlined'}
            color={active ? 'primary' : 'default'}
            onClick={e =>
              option.value === 'custom'
                ? setAnchor(e.currentTarget)
                : onPeriodChange(option.value)
            }
          />
        );
      })}
      <Popover
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box sx={{ p: 2 }}>
          <DateRangePicker value={customRange} onChange={handleCustomChange} />
        </Box>
      </Popover>
    </Box>
  );
};

// Styles
const RootSx: SxProps = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 1,
};
