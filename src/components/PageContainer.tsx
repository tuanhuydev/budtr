import { FC, PropsWithChildren } from 'react';

export interface TabContainerProps extends PropsWithChildren {
  value: number;
  index: number;
  /** Stable id used for the tab / tabpanel aria wiring. */
  id: string;
}
export const TabContainer: FC<TabContainerProps> = ({
  value,
  index,
  id,
  children,
}) => {
  return (
    <div
      role='tabpanel'
      id={`budtr-tabpanel-${id}`}
      aria-labelledby={`budtr-tab-${id}`}
      hidden={value !== index}
    >
      {children}
    </div>
  );
};
