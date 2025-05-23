// components/MessageBubble.tsx
import ReactMarkdown from 'react-markdown';
import ReactDOMServer from 'react-dom/server';
import React, {lazy, Suspense} from 'react';
import {ExtendedMessageProps as MessageProps} from './types';
import { Bubble } from '../Bubble';
import {Typing, } from "../Typing"
import {TypingBubble} from "../TypingBubble"
import './style.less'
import { useLocale } from '../ConfigProvider';
// 导入所需的插件
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
// 根据需要导入其他插件
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {dark} from 'react-syntax-highlighter/dist/esm/styles/prism'

export interface MessageBubbleProps {
  message: MessageProps;
  getImageUrl?: (url: string) => any;
  handleFileDetail?: (detail:any) => any; // 附件信息
  handleDetail?: (detail:any, type:string) => any; // 点击a标签/其他 type link/text
}

// 动态导入 Attachment 组件
const Attachment = lazy(() => import('./Attachment'));

export const MessageBubble = React.forwardRef<HTMLDivElement, MessageBubbleProps> ((props, ref) => {
  const { trans } = useLocale('MessageBubble');
  const { message, getImageUrl, handleFileDetail, handleDetail} = props
  const { type, content, attachments, position } = message;
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const CustomLink = ({ href, children, ...props }:any) => {
    const handleClick = (event:any) => {
      event.preventDefault(); // 阻止默认跳转行为
      if (handleDetail) {
        console.log('Link clicked:', href); // 打印链接地址
        handleDetail(href, 'link')
      }else {
        window.open(href, '_blank'); // 示例：在新窗口中打开链接
      }
    };

    return (
      <a href={href} onClick={handleClick} {...props}>
        {children}
      </a>
    );
  };
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const mdHtml = (content: any) => (
    <ReactMarkdown
      className="messageContent"
      components={{
        a: CustomLink, // 替换默认的 <a> 渲染器
        // eslint-disable-next-line @typescript-eslint/no-shadow
        code(props) {
          const {children, className, node, ...rest} = props
          const match = /language-(\w+)/.exec(className || '')
          return match ? (
            // @ts-ignore
            <SyntaxHighlighter
              {...rest}
              PreTag="div"
              children={String(children).replace(/\n$/, '')}
              language={match[1]}
              style={dark}
            />
          ) : (
            <code {...rest} className={className}>
              {children}
            </code>
          )
        }
      }}
      remarkPlugins={[remarkGfm , remarkMath ]}
      rehypePlugins={[rehypeRaw , rehypeKatex ]}
    >
      {content}
    </ReactMarkdown>
  )

  if (type === 'text' && attachments && attachments.length > 0) {
    return (
      <div className={`message-attachments ${position}`} key={message.id} ref={ref}>
        {attachments.map((attachment: any) => (
          <Suspense fallback={<div>{trans('loading')}</div>} key={attachment.object_name}>
            <Attachment attachment={attachment} getImageUrl={getImageUrl}
                        handleFileDetail={handleFileDetail} />
          </Suspense>
        ))}
        <Bubble>
          {content &&
            mdHtml(content)
          }
        </Bubble>
      </div>
    );
  }

  // 转换函数：将 Markdown 转换为 HTML 字符串
  function markdownToHtml(markdownText: any) {
    return ReactDOMServer.renderToStaticMarkup(
      mdHtml(markdownText)
    );
  }


  switch (type) {
    case 'text':
      return (
        <Bubble>
          {mdHtml(content)}
        </Bubble>
      );
    case 'stream':
      return (
        <TypingBubble content={content}
                      messageRender={markdownToHtml} isRichText
                      options={{step: [1, 6], interval: 100}}/>
      )
    case 'typing':
      return <Typing/>;
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

