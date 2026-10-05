import { SvgIcon, SvgIconProps } from '@mui/material';

const strokeProps = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

export const OverviewIcon = (props: SvgIconProps) => (
  <SvgIcon {...props} viewBox='0 0 24 24'>
    {[5, 12, 19].flatMap(y =>
      [5, 12, 19].map(x => (
        <circle
          key={`${x}-${y}`}
          cx={x}
          cy={y}
          r={1.6}
          fill='currentColor'
          stroke='none'
        />
      ))
    )}
  </SvgIcon>
);

export const TransactionsIcon = (props: SvgIconProps) => (
  <SvgIcon {...props} viewBox='0 0 24 24'>
    <path d='M4 8h15l-3.5-3.5M20 16H5l3.5 3.5' {...strokeProps} />
  </SvgIcon>
);

export const AssetIcon = (props: SvgIconProps) => (
  <SvgIcon {...props} viewBox='0 0 24 24'>
    <rect x='3' y='6' width='18' height='13' rx='2.5' {...strokeProps} />
    <path d='M3 10h18M16 14.5h2' {...strokeProps} />
  </SvgIcon>
);
