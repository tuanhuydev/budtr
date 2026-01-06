import { FC, PropsWithChildren } from 'react';

export interface TabContainerProps extends PropsWithChildren {
  value: number;
  index: number;
}
export const TabContainer: FC<TabContainerProps> = ({
  value,
  index,
  children,
}) => {
  return (
    <div role='tabpanel' hidden={value !== index}>
      {children}
    </div>
  );
};
