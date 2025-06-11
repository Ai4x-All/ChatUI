// components/MessageBubble.tsx
import ReactDOMServer from 'react-dom/server';
import React, {lazy, Suspense} from 'react';
import {ExtendedMessageProps as MessageProps} from './types';
import {Bubble} from "../Bubble"
import {Divider} from "../Divider"
import {Icon} from "../Icon"
import {Quote} from "../Quote"
import {Think} from "../Think"
import {Typing} from "../Typing"
import {TypingBubble} from "../TypingBubble"
import './style.less'
import { CustomMarkdown } from "../CustomMarkdown";

export interface MessageBubbleProps {
  message: MessageProps;
  getImageUrl?: (url: string) => any;
  handleFileDetail?: (detail: any) => any; // 附件信息
  handleDetail?: (detail: any, type: string) => any; // 点击a标签/其他 type link/text
  playingId?: string | number
  handlePlaying?: (str:string, id:any) => void
  theme?:string
}


// 动态导入 Attachment 组件
const Attachment = lazy(() => import('./Attachment'));

export const MessageBubble = React.forwardRef<HTMLDivElement, MessageBubbleProps>((props, ref) => {
  const {message, getImageUrl, handleFileDetail, handleDetail, theme } = props

  // const demoStr = "\n\n```mermaid\ngraph LR\n  FailureMode --> RootCause\n  RootCause --> TriggerFactor\n```\n\n根因分析\n\n* 直接失效模式\n\n  * BMC以太网接口启动异常（bmc_ethernet_interface-bmc_init-ERROR-Exception）\n    * 观测数据：共出现 97 次，表现为 BMC 初始化过程中的网络接口异常。\n    * 关联性：错误信息与修复方案（FOX Checking step & action）一致，显示为系统层面的配置或初始化问题。\n\n* 根本原因\n\n  * Reburn/Replace IO 相关问题\n    * 过程缺陷：错误代码表明存在需要重新烧录固件或更换 IO 组件的根本故障。\n    * 观测数据：所有 97 个失败事件的原因代码与上述修复步骤一致，提示这是统一的故障来源。\n    * 关联性：错误现象和维修方案均指向硬件层面的初始化配置失常，特别是 BMC 通信部分的问题。\n\n* 触发因素\n\n  * 重复出现的 BMC 初始化错误表明可能存在设备批次或制造缺陷\n  * 时间窗口：未明确指出，但高频重复意味着触发具有持续性或批次性\n  * 观测数据：同一错误和修复步骤重复次数为 97，表明此问题在特定设备/流程下频繁触发\n  * 建议检查硬件批次一致性，并优化 BMC 初始化流程，避免重复性 Reburn 操作。"
  const mdHtml = (contentStr: any,loadingFlag?:boolean) => (
    <Suspense fallback={{}}>
      <div style={{display: 'flex', alignItems: "end", gap: '1em'}}>
        <CustomMarkdown content={contentStr} handleDetail={handleDetail} theme={theme}/>
        {message.loading && loadingFlag ? <Icon type="spinner" spin/> : null}
      </div>
    </Suspense>
  )


  // 转换函数：将 Markdown 转换为 HTML 字符串
  function markdownToHtml(markdownText: any) {
    return ReactDOMServer.renderToStaticMarkup(
      mdHtml(markdownText)
    );
  }

  // think 文字显示
  const meaageTypeText: any = (types: string) => {
    switch (types) {
      case 'processing':
        return `数据处理 ${types}`
      case 'thinking':
        return `任务拆解`
      // 其他消息类型的渲染
      default:
        return types;
    }
  }


  const typeMessageBubble = (info:any, group?:string) => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const {type, content, computer_content} = info;
    switch (type) {
      case 'text':
      case 'summary':
      case 'reference':
      case 'insight':
        return (<Bubble type={group}>{mdHtml(content, true)}</Bubble>);
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
            <img src={content.url} alt=""/>
          </Bubble>
        );
      case 'voice':
        return (
          <audio controls>
            <source src={content} type="audio/wav" />
            您的浏览器不支持音频播放。
          </audio>
        );
      // case 'processing':
      case 'thinking':
        return <Think text={meaageTypeText(type)}>{mdHtml(content)}</Think>
      case 'processing':
        return (<Bubble type={group}>{mdHtml(content, true)}</Bubble>);
      case 'detail':
        return (<div style={{cursor: 'pointer'}} onClick={() => handleDetail?.(computer_content, 'detail')}>
          <Quote author="">
            {mdHtml(content, true)}
          </Quote>
        </div>);
      case 'group':
        return group ? <Bubble type={group}>{mdHtml(content, true)}</Bubble> : <Divider style={{width: '50%'}} position="left">{content}</Divider>
      // 其他消息类型的渲染
      default:
        return null;
    }
  }

  if (message.type === 'text' && message.attachments && message.attachments.length > 0) {
    return (
      <div className={`message-attachments ${message.position}`} key={message.id} ref={ref}>
        {
          message.attachments.map((attachment: any) => (
            <Suspense fallback={<div>加载附件...</div>} key={attachment.object_name}>
              <Attachment attachment={attachment} getImageUrl={getImageUrl}
                          handleFileDetail={handleFileDetail}/>
            </Suspense>
          ))
        }
        <Bubble>{message.content && mdHtml(message.content)}</Bubble>
      </div>
    );
  }


  const childDom = (arr: any) => {
    return arr.map((child_item: any, index: number) => {
      if (child_item.child && child_item.child.length > 0) {
        return (
          <React.Fragment key={index}>
            {typeMessageBubble(child_item, 'group')}
            {childDom(child_item.child)}
          </React.Fragment>
        );
      } else {
        return (
          <React.Fragment key={index}>
            {typeMessageBubble(child_item, 'group')}
          </React.Fragment>
        );
      }
    });
  };

  if (message.child && message.child.length > 0) {
    const childArr = childDom(message.child)

    return <Bubble>{childArr}</Bubble>
  }
  return <React.Fragment key={message.id}>{typeMessageBubble(message)}</React.Fragment>
});

export default MessageBubble;
