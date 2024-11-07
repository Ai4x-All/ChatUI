import React from 'react';

export interface BubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: string;
  content?: string | React.ReactNode | undefined | null | any; // content 的类型允许 string 或 ReactNode
}

export const Bubble = React.forwardRef<HTMLDivElement, BubbleProps>((props, ref) => {
  const { type = 'text', content, children, ...other } = props;
  return (
    <div className={`Bubble ${type}`} data-type={type} ref={ref} {...other}>
      {content && <div className="content">{content}</div>} {/* 这里用 div 包裹 content */}
      {children}
    </div>
  );
});
