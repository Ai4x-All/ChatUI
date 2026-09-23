import React from 'react';
import clsx from 'clsx';
import { SystemMessage } from './SystemMessage';
import { IMessageStatus } from '../MessageStatus';
import { Avatar } from '../Avatar';
import { Popover, PopoverPlacement } from '../Popover';
import { Time } from '../Time';

export interface User {
  avatar?: string;
  name?: string;
  url?: string;
  [k: string]: any;
}

export type MessageId = string;

export interface MessageProps {
  /**
   * 唯一ID
   */
  _id: MessageId;
  /**
   * 消息类型
   */
  type: string;
  /**
   * 消息内容
   */
  content?: any;
  /**
   * 消息创建时间
   */
  createdAt?: number;
  /**
   * 消息创建时间戳
   */
  createdAtTime?: number;
  /**
   * 消息发送者信息
   */
  user?: User;
  /**
   * 消息位置
   */
  position?: 'left' | 'right' | 'center' | 'pop';
  /**
   * 是否显示时间
   */
  hasTime?: boolean;
  /**
   * 状态
   */
  status?: IMessageStatus;
  /**
   * 状态 描述
   */
  status_description?: string;
  /**
   * 消息内容渲染函数
   */
  renderMessageContent?: (message: MessageProps) => React.ReactNode;
  /**
   * 点击头像回调
   */
  onAvatarClick?: (message: MessageProps, event: React.MouseEvent<HTMLElement>) => void;
  /**
   * 头像卡片渲染函数，返回内容时点击头像会在头像旁弹出卡片
   */
  renderAvatarCard?: (message: MessageProps) => React.ReactNode;
  /**
   * 头像卡片的弹出位置，默认左侧头像往右弹、右侧头像往左弹
   */
  avatarCardPlacement?: PopoverPlacement;
}

const Message = (props: MessageProps) => {
  const {
    renderMessageContent = () => null,
    onAvatarClick,
    renderAvatarCard,
    avatarCardPlacement,
    ...msg
  } = props;
  const { type, content, user = {}, _id: id, position = 'left', hasTime = true, createdAt } = msg;
  const { name, avatar } = user;
  const statusExpiresAt = (msg.createdAtTime ?? 0) + 3 * 60 * 1000;
  const canShowStatus = user.type === 'agent'
    && Boolean(msg.status_description)
    && Boolean(msg.createdAtTime);
  const [showStatusDescription, setShowStatusDescription] = React.useState(
    () => canShowStatus && Date.now() < statusExpiresAt,
  );
  const [avatarCardVisible, setAvatarCardVisible] = React.useState(false);
  const avatarRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    const remainingTime = statusExpiresAt - Date.now();
    const shouldShow = canShowStatus && remainingTime > 0;

    setShowStatusDescription(shouldShow);

    if (!shouldShow) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setShowStatusDescription(false);
    }, remainingTime);

    return () => window.clearTimeout(timer);
  }, [canShowStatus, statusExpiresAt]);

  // 滚动后卡片会和头像脱节，所以一滚动就关掉
  React.useEffect(() => {
    if (!avatarCardVisible) return undefined;

    const close = () => setAvatarCardVisible(false);
    // scroll 事件不冒泡，用捕获才能监听到消息列表的滚动
    document.addEventListener('scroll', close, true);
    return () => document.removeEventListener('scroll', close, true);
  }, [avatarCardVisible]);

  if (type === 'system') {
    return <SystemMessage content={content.text} action={content.action} />;
  }

  const isRL = position === 'right' || position === 'left';
  const avatarClickable = !user.hidUser && !!(onAvatarClick || renderAvatarCard);
  // 头像在右侧时卡片往左弹，避免超出屏幕
  const cardPlacement = avatarCardPlacement || (position === 'right' ? 'left' : 'right');

  const handleAvatarClick = (e: React.MouseEvent<HTMLElement>) => {
    if (onAvatarClick) {
      onAvatarClick(msg, e);
    }
    if (renderAvatarCard) {
      // 有卡片时不跳转链接，改为在头像旁弹出卡片
      e.preventDefault();
      avatarRef.current = e.currentTarget;
      setAvatarCardVisible(true);
    }
  };

  return (
    <div className={clsx('Message', position)} data-id={id} data-type={type}>
      {hasTime && createdAt && (
        <div className="Message-meta">
          <Time date={createdAt} />
        </div>
      )}
      <div className="Message-main">
        {isRL && avatar && (
          <Avatar
            src={avatar}
            shape="square"
            alt={name}
            url={user.url}
            className={user.hidUser ? 'Opacity_0' : ''}
            onClick={avatarClickable ? handleAvatarClick : undefined}
          />
        )}
        {renderAvatarCard && avatarCardVisible && avatarRef.current && (
          <Popover
            className="Message-avatarCard"
            active={avatarCardVisible}
            target={avatarRef.current}
            placement={cardPlacement}
            hideArrow
            onClose={() => setAvatarCardVisible(false)}
          >
            {renderAvatarCard(msg)}
          </Popover>
        )}
        <div className="Message-inner">
          {isRL && name && !user.hidUser && (
            <div className="Message-author">
              {name} {showStatusDescription && msg.status_description}
            </div>
          )}
          <div className="Message-content" role="alert" aria-live="assertive" aria-atomic="false">
            {renderMessageContent(msg)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Message);
