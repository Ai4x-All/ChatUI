import React, { useEffect } from 'react';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { useLocale } from '../ConfigProvider';

interface BackBottomProps {
  count: number;
  onClick: () => void;
  onDidMount?: () => void;
  showCount?: boolean;
  unreadText?: string;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export const BackBottom = ({ count, onClick, onDidMount, showCount = true, unreadText, loading = false, disabled = false, className }: BackBottomProps) => {
  const { trans } = useLocale('BackBottom');
  let text = unreadText || trans('bottom');
  if (!unreadText && showCount && count) {
    text = trans(count === 1 ? 'newMsgOne' : 'newMsgOther').replace('{n}', count);
  }

  useEffect(() => {
    if (onDidMount) {
      onDidMount();
    }
  }, [onDidMount]);

  return (
    <div className={'BackBottom ' + (className || '')}>
      <Button className="slide-in-right-item" onClick={onClick} loading={loading} disabled={disabled || loading}>
        {text}
        {!loading && <Icon type="chevron-double-down" />}
      </Button>
    </div>
  );
};
