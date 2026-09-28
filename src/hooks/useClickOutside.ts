import { useEffect, useRef } from 'react';

export default function useClickOutside<T extends HTMLElement = any>(
  handler: (event: any) => void,
  eventName: string = 'click',
) {
  const ref = useRef<T>();

  useEffect(() => {
    const listener = (e: any) => {
      const targetElement = ref.current;
      // ✅ 新增：如果点击元素命中 data-ignore-click-outside，直接退出，不触发关闭
      const ignoreEl = e.target?.closest('[data-ignore-click-outside]');
      if (ignoreEl) return;

      if (!targetElement || targetElement.contains(e.target)) {
        return;
      }
      if (handler) {
        handler(e);
      }
    };

    document.addEventListener(eventName, listener);

    return () => {
      document.removeEventListener(eventName, listener);
    };
  }, [eventName, handler]);

  return ref;
}
