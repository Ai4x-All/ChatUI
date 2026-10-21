/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect, useRef, useCallback, useImperativeHandle } from 'react';
import { PullToRefresh, PullToRefreshHandle, ScrollToEndOptions } from '../PullToRefresh';
import { Message, MessageProps } from '../Message';
import { BackBottom } from '../BackBottom';
import canUse from '../../utils/canUse';
import throttle from '../../utils/throttle';
import getToBottom from '../../utils/getToBottom';

const listenerOpts = canUse('passiveListener') ? { passive: true } : false;

export interface MessageContainerProps {
  messages: MessageProps[];
  renderMessageContent: (message: MessageProps) => React.ReactNode;
  isTyping?: boolean;
  loadMoreText?: string;
  onRefresh?: () => Promise<any>;
  onScroll?: (event: React.UIEvent<HTMLDivElement, UIEvent>) => void;
  renderBeforeMessageList?: () => React.ReactNode;
  onBackBottomShow?: () => void;
  onBackBottomClick?: () => void;
  /**
   * 点击头像回调
   */
  onAvatarClick?: MessageProps['onAvatarClick'];
  /**
   * 头像卡片渲染函数，返回内容时点击头像会在头像旁弹出卡片
   */
  renderAvatarCard?: MessageProps['renderAvatarCard'];
  /**
   * 头像卡片的弹出位置
   */
  avatarCardPlacement?: MessageProps['avatarCardPlacement'];

  autoScrollToEnd?: boolean;
  autoScrollToEndAnimated?: boolean;

  /** custom 模式下由外部接管消息滚动、分页和未读状态。 */
  scrollMode?: 'default' | 'custom';

  /** 点击回到底部自动滚动 */
  backBottomAutoScroll?: boolean;
  /** 回到底部是否显示未读数量 */
  backBottomShowCount?: boolean;
  /** 进入会话是否已有未读消息的最早未读 */
  hasUnreadMessages?: boolean;
  backBottomUnreadText?: string;

  backBottomLoading?: boolean;

  unreadLoading?: boolean;
  /** 自定加载提示 */
  topLoading?: boolean;
  bottomLoading?: boolean;

  loadingText?: string;

  onUnreadClick?: () => void;
}

export interface MessageContainerHandle {
  ref: React.RefObject<HTMLDivElement>;
  scrollToEnd: (options?: ScrollToEndOptions) => void;
}

function isNearBottom(el: HTMLElement, n: number) {
  const offsetHeight = Math.max(el.offsetHeight, 600);
  return getToBottom(el) < offsetHeight * n;
}

export const MessageContainer = React.forwardRef<MessageContainerHandle, MessageContainerProps>(
  (props, ref) => {
    const {
      messages,
      isTyping,
      loadMoreText,
      onRefresh,
      onScroll,
      renderBeforeMessageList,
      renderMessageContent,
      onBackBottomShow,
      onBackBottomClick,
      onUnreadClick,
      onAvatarClick,
      renderAvatarCard,
      avatarCardPlacement,
      autoScrollToEnd = true,
      autoScrollToEndAnimated = true,
      scrollMode = 'default',
      backBottomAutoScroll = true,
      backBottomShowCount = true,
      hasUnreadMessages = false,
      backBottomUnreadText,
      loadingText = '数据加载中...',
      backBottomLoading = false,
      unreadLoading = false,
      topLoading = false,
      bottomLoading = false
    } = props;

    const isCustomScroll = scrollMode === 'custom';

    const [showBackBottom, setShowBackBottom] = useState(false);
    const [newCount, setNewCount] = useState(0);
    const showBackBottomtRef = useRef(showBackBottom);
    const newCountRef = useRef(newCount);
    const prevLastMessageIdRef = useRef<string | undefined>();
    const messagesRef = useRef<HTMLDivElement>(null);
    const scrollerRef = useRef<PullToRefreshHandle>(null);
    const lastMessage = messages[messages.length - 1];

    const clearBackBottom = () => {
      setNewCount(0);
      setShowBackBottom(false);
    };

    const scrollToEnd = useCallback((opts?: ScrollToEndOptions) => {
      if (scrollerRef.current) {
        if (!showBackBottomtRef.current || (opts && opts.force)) {
          scrollerRef.current.scrollToEnd(opts);
          if (showBackBottomtRef.current) {
            clearBackBottom();
          }
        }
      }
    }, []);

    const handleBackBottomClick = () => {
      if (!isCustomScroll) {
        if (backBottomAutoScroll) {
          scrollToEnd({ animated: false, force: true });
          // setNewCount(0);
          // setShowBackBottom(false);
        } else {
          clearBackBottom();
        }
      }

      if (onBackBottomClick) {
        onBackBottomClick();
      }
    };

    const checkShowBottomRef = useRef(
      throttle((el: HTMLElement) => {
        if (isNearBottom(el, 3)) {
          if (newCountRef.current) {
            // 如果有新消息，离底部0.5屏-隐藏提示
            if (isNearBottom(el, 0.5)) {
              // setNewCount(0);
              // setShowBackBottom(false);
              clearBackBottom();
            }
          } else {
            setShowBackBottom(false);
          }
        } else {
          // 3屏+显示回到底部
          setShowBackBottom(true);
        }
      }),
    );

    const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
      checkShowBottomRef.current(e.currentTarget);
      /*if (!isCustomScroll) {
        checkShowBottomRef.current(e.currentTarget);
      }*/

      if (onScroll) {
        onScroll(e);
      }
    };

    useEffect(() => {
      newCountRef.current = newCount;
    }, [newCount]);

    useEffect(() => {
      showBackBottomtRef.current = showBackBottom;
    }, [showBackBottom]);

    useEffect(() => {
      if (isCustomScroll) return;

      const scroller = scrollerRef.current;
      const wrapper = scroller && scroller.wrapperRef.current;

      if (!wrapper || !lastMessage || lastMessage.position === 'pop') {
        return;
      }

      const prevLastMessageId = prevLastMessageIdRef.current;
      prevLastMessageIdRef.current = lastMessage._id;

      if (lastMessage.position === 'right') {
        // 自己发的消息，强制滚动到底部
        // scrollToEnd({ force: true });
        if (autoScrollToEnd) {
          scrollToEnd({ animated: autoScrollToEndAnimated, force: true });
        }
      } else if (isNearBottom(wrapper, 2)) {
        if (autoScrollToEnd) {
          const animated = autoScrollToEndAnimated && !!wrapper.scrollTop;
          scrollToEnd({ animated, force: true });
        } else if (prevLastMessageId && prevLastMessageId !== lastMessage._id) {
          setNewCount((c) => c + 1);
          setShowBackBottom(true);
        }
      } else {
        setNewCount((c) => c + 1);
        setShowBackBottom(true);
      }
    }, [isCustomScroll, lastMessage, scrollToEnd, autoScrollToEnd, autoScrollToEndAnimated]);

    useEffect(() => {
      if (!autoScrollToEnd || isCustomScroll) return;

      scrollToEnd({ animated: autoScrollToEndAnimated });
    }, [isTyping, scrollToEnd, autoScrollToEnd, autoScrollToEndAnimated, isCustomScroll]);

    useEffect(() => {
      const wrapper = messagesRef.current!;

      let needBlur = false;
      let startY = 0;

      function reset() {
        needBlur = false;
        startY = 0;
      }

      function touchStart(e: TouchEvent) {
        const { activeElement } = document;
        if (activeElement && activeElement.nodeName === 'TEXTAREA') {
          needBlur = true;
          startY = e.touches[0].clientY;
        }
      }

      function touchMove(e: TouchEvent) {
        if (needBlur && Math.abs(e.touches[0].clientY - startY) > 20) {
          (document.activeElement as HTMLElement).blur();
          reset();
        }
      }

      wrapper.addEventListener('touchstart', touchStart, listenerOpts);
      wrapper.addEventListener('touchmove', touchMove, listenerOpts);
      wrapper.addEventListener('touchend', reset);
      wrapper.addEventListener('touchcancel', reset);

      return () => {
        wrapper.removeEventListener('touchstart', touchStart);
        wrapper.removeEventListener('touchmove', touchMove);
        wrapper.removeEventListener('touchend', reset);
        wrapper.removeEventListener('touchcancel', reset);
      };
    }, []);

    useImperativeHandle(ref, () => ({ ref: messagesRef, scrollToEnd }), [scrollToEnd]);

    return (
      <div className="MessageContainer" ref={messagesRef}>
        <div className="MessageContainer-before">
          {renderBeforeMessageList && renderBeforeMessageList()}
        </div>
        <PullToRefresh
          onRefresh={onRefresh}
          onScroll={handleScroll}
          loadMoreText={loadMoreText}
          ref={scrollerRef}
        >
          <>
            {topLoading && <div className="MessageContainer-loading ">{loadingText}</div>}
            <div className="MessageList">
              {messages.map((msg) => (
                  <Message
                    {...msg}
                    renderMessageContent={renderMessageContent}
                    onAvatarClick={onAvatarClick}
                    renderAvatarCard={renderAvatarCard}
                    avatarCardPlacement={avatarCardPlacement}
                    key={msg._id}
                  />
                ))}
              {isTyping && <Message type="typing" _id="typing" />}
            </div>
            {bottomLoading && <div className="MessageContainer-loading">{loadingText}</div>}
          </>
        </PullToRefresh>
        {(showBackBottom || backBottomLoading) && (
            <BackBottom
              count={newCount}
              showCount={backBottomShowCount}
              onClick={handleBackBottomClick}
              onDidMount={onBackBottomShow}
              loading={backBottomLoading}
              disabled={unreadLoading}
        />)}
        {
          hasUnreadMessages && (
            <BackBottom
              count={0}
              showCount={false}
              unreadText={backBottomUnreadText}
              onClick={() => (onUnreadClick ? onUnreadClick() : handleBackBottomClick())}
              loading={unreadLoading}
              disabled={backBottomLoading}
              className={(showBackBottom || backBottomLoading) ? 'BackBottom-unread BackBottom-unread-stack' : 'BackBottom-unread'}
            />
          )
        }
      </div>
    );
  },
);
