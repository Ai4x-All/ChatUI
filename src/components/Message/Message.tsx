import React from 'react';
import clsx from 'clsx';
import { SystemMessage } from './SystemMessage';
import { IMessageStatus } from '../MessageStatus';
import { Avatar } from '../Avatar';
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
}

const Message = (props: MessageProps) => {
  const { renderMessageContent = () => null, ...msg } = props;
  const { type, content, user = {}, _id: id, position = 'left', hasTime = true, createdAt } = msg;
  const { name, avatar } = user;
  const statusExpiresAt = (msg.createdAtTime ?? 0) + 3 * 60 * 1000;
  const canShowStatus = user.type === 'agent'
    && Boolean(msg.status_description)
    && Boolean(msg.createdAtTime);
  const [showStatusDescription, setShowStatusDescription] = React.useState(
    () => canShowStatus && Date.now() < statusExpiresAt,
  );

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

  if (type === 'system') {
    return <SystemMessage content={content.text} action={content.action} />;
  }

  const isRL = position === 'right' || position === 'left';

  return (
    <div className={clsx('Message', position)} data-id={id} data-type={type}>
      {hasTime && createdAt && (
        <div className="Message-meta">
          <Time date={createdAt} />
        </div>
      )}
      <div className="Message-main">
        {isRL && avatar && <Avatar src={avatar} shape="square" alt={name} url={user.url} className={user.hidUser ? 'Opacity_0' : ''}/>}
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
