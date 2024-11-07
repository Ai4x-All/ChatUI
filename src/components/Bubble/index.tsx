import React from 'react';

export interface BubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: string;
  customContent?: React.ReactNode; // 重命名为 customContent
}

export const Bubble = React.forwardRef<HTMLDivElement, BubbleProps>((props, ref) => {
  const { type = 'text', customContent, children, ...other } = props;
  return (
    <div className={`Bubble ${type}`} data-type={type} ref={ref} {...other}>
      {customContent && <p>{customContent}</p>}
      {children}
    </div>
  );
});
