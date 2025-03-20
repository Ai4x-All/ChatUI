// components/MessageBubble.tsx
import ReactMarkdown from 'react-markdown';
import React, { lazy, Suspense } from 'react';
import { ExtendedMessageProps as MessageProps } from './types';
import { Bubble } from '../Bubble';

// 导入所需的插件
import remarkGfm from 'remark-gfm';
// import rehypeRaw from 'rehype-raw';
// 根据需要导入其他插件
// import remarkMath from 'remark-math';
// import rehypeKatex from 'rehype-katex';

export interface MessageBubbleProps {
  message: MessageProps;
  getImageUrl?: (url: string) => any;
  handleFileDetail?: (detail:any) => any;
}

// 动态导入 Attachment 组件
const Attachment = lazy(() => import('./Attachment'));

export const MessageBubble = React.forwardRef<HTMLDivElement, MessageBubbleProps> ((props, ref) => {
  const { message, getImageUrl, handleFileDetail} = props
  const { type, content, attachments, position } = message;

  if (type === 'text' && attachments && attachments.length > 0) {
    return (
      <div className={`message-attachments ${position}`} key={message.id} ref={ref}>
        {attachments.map((attachment: any) => (
          <Suspense fallback={<div>加载附件...</div>} key={attachment.object_name}>
            <Attachment attachment={attachment} getImageUrl={getImageUrl} handleFileDetail={handleFileDetail} />
          </Suspense>
        ))}
        <Bubble>
          {content &&
            <ReactMarkdown
              className="messageContent"
              // 添加插件
              remarkPlugins={[remarkGfm /*, remarkMath */]}
              // rehypePlugins={[rehypeRaw /*, rehypeKatex */]}
              // 如果使用数学公式，还需要添加对应的 CSS
            >
              {content}
            </ReactMarkdown>
          }
        </Bubble>
      </div>
    );
  }

  switch (type) {
    case 'text':
      return (
        <Bubble>
          <ReactMarkdown
            className="messageContent"
            remarkPlugins={[remarkGfm /*, remarkMath */]}
            // rehypePlugins={[rehypeRaw /*, rehypeKatex */]}
          >
            {content}
          </ReactMarkdown>
        </Bubble>
      );
    case 'image':
      return (
        <Bubble type="image">
          <img src={content.url} alt="" />
        </Bubble>
      );
    // 其他消息类型的渲染
    default:
      return null;
  }
});

