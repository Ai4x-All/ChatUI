import React, { useState, useLayoutEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import useMount from '../../hooks/useMount';
import useClickOutside from '../../hooks/useClickOutside';
import useWindowResize from '../../hooks/useWindowResize';

export type PopoverPlacement = 'top' | 'bottom' | 'left' | 'right';

export type PopoverProps = {
  className?: string;
  active: boolean;
  target: HTMLElement;
  placement?: PopoverPlacement;
  hideArrow?: boolean;
  onClose: () => void;
  children?: React.ReactNode;
};

// 气泡与视口边缘的最小间距
const GUTTER = 8;

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max));
}

export const Popover = (props: PopoverProps) => {
  const { className, active, target, placement = 'top', hideArrow, children, onClose } = props;
  const wrapper = useClickOutside(onClose, 'mousedown');
  const { didMount, isShow } = useMount({ active, ref: wrapper });
  const [style, setStyle] = useState({});

  const updatePos = useCallback(() => {
    if (!wrapper.current) return;

    const targetRect = target.getBoundingClientRect();
    const rect = wrapper.current.getBoundingClientRect();

    let top: number;
    let left: number;

    switch (placement) {
      case 'bottom':
        top = targetRect.bottom;
        left = targetRect.left;
        break;
      case 'left':
        top = targetRect.top;
        left = targetRect.left - rect.width;
        break;
      case 'right':
        top = targetRect.top;
        left = targetRect.right;
        break;
      default:
        top = targetRect.top - rect.height;
        left = targetRect.left;
    }

    setStyle({
      top: `${clamp(top, GUTTER, window.innerHeight - rect.height - GUTTER)}px`,
      left: `${clamp(left, GUTTER, window.innerWidth - rect.width - GUTTER)}px`,
    });
  }, [placement, target, wrapper]);

  // 用 layout effect 在浏览器绘制前定位，避免先渲染在左上角再跳到目标位置
  useLayoutEffect(() => {
    if (wrapper.current) {
      wrapper.current.focus();
      updatePos();
    }
  }, [didMount, updatePos, wrapper]);

  useWindowResize(updatePos);

  if (!didMount) return null;

  return createPortal(
    <div
      className={clsx('Popover', `Popover--${placement}`, className, { active: isShow })}
      ref={wrapper}
      style={style}
    >
      <div className="Popover-body">{children}</div>
      {!hideArrow && (
        <svg className="Popover-arrow" viewBox="0 0 9 5">
          <polygon points="0,0 5,5, 9,0" />
        </svg>
      )}
    </div>,
    document.body,
  );
};
