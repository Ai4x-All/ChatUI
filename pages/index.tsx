import React from 'react';
import { Chat } from '@Ai4x-All/chatui-core-private';
import '@Ai4x-All/chatui-core-private/dist/index.css';

export default function Home() {
  return (
    <div style={{ height: '100vh' }}>
      <Chat
        messages={[
          {
            type: 'text',
            content: { text: '你好！我是 AI 助手，有什么可以帮你的吗？' },
            position: 'left',
          },
        ]}
        locale="zh-CN"
        placeholder="请输入消息..."
        onSend={(type, val) => {
          console.log('发送消息:', type, val);
        }}
      />
    </div>
  );
} 