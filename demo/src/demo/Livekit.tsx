/*
// App.tsx (React 示例)
import React, { useEffect, useRef, useState } from 'react';
import { Input, LiveKitSDK } from '../../../src';

export default function App() {
  const sdkRef = useRef<LiveKitSDK | null>(null);
  const [connectionState, setConnectionState] = useState('');
  const [value, setValue] = useState('哈哈哈');

  useEffect(() => {
    // 在组件挂载时初始化
    const sdk = new LiveKitSDK({
      wsUrl: 'wss://lks-prod.xdforg.org:10443',
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiMTc2MDAyNDIxNzkiLCJ2aWRlbyI6eyJyb29tQ3JlYXRlIjp0cnVlLCJyb29tTGlzdCI6dHJ1ZSwicm9vbVJlY29yZCI6dHJ1ZSwicm9vbUFkbWluIjp0cnVlLCJyb29tSm9pbiI6dHJ1ZSwicm9vbSI6IlJNLTJFQkMyQ0Y0QjM4QzRBNTA5MDhGOEU4QjY0RDI3ODZEIiwiY2FuUHVibGlzaCI6dHJ1ZSwiY2FuU3Vic2NyaWJlIjp0cnVlLCJjYW5QdWJsaXNoRGF0YSI6dHJ1ZX0sInN1YiI6IjE2ZDNlYTdmLThmNjYtNDc2MS1iZjI5LTExODhjMTFkZGU5MiIsImlzcyI6IkFQSVBpSzhUZkhaMTEwUCIsIm5iZiI6MTczOTk1ODYxNCwiZXhwIjoxNzM5OTgwMjE0fQ.koS2DiizuQbpqO7vC2q1AVQs6U0-ZlHDlD-7tFswJ40',
      roomId: 'RM-2EBC2CF4B38C4A50908F8E8B64D2786D',
      config: {
        camera: false,
        mic: false,
      },
      onConnectionStateChanged: (state) => {
        console.log(state);
        setConnectionState(state);
      },
      onParticipantConnected: (id) => {
        console.log('Participant connected:', id);
      },
      onDataReceived: (msg, topic) => {
        // console.log(topic);
        // console.log(new TextDecoder("utf-8").decode(msg));
        if (topic == "stream") {
          // console.log('stream from agent:')
          const decoded = new TextDecoder("utf-8").decode(msg)
          if (decoded.startsWith('b:')) {
            const agentInfo = JSON.parse(decoded.substring(2))
            console.log('流式传输开始:', agentInfo)
          } else if (decoded.startsWith('c:')) {
            console.log(decoded.substring(2))

          } else if (decoded.startsWith('e:')) {
            console.log('流式传输结束')
            console.log(JSON.parse(decoded.substring(2)));
          }
          // console.log(decoded)
        } else {
          const decoded = new TextDecoder("utf-8").decode(msg)
          const message = JSON.parse(decoded);
          const messageData = JSON.parse(message.message);
          console.log(messageData);
        }
      },
      rpcMethod: ['command'],
      rpcMethodCallback: (method, data) => {
        console.log(`RPC method: ${method}, from: ${data.callerIdentity}`);
      },
    });
    // 连接房间
    sdk.connect().then(() => {
      sdkRef.current = sdk;
    });

    // 卸载时离开房间
    return () => {
      sdk.disconnect();
    };
  }, []);

  const handleSendMessage = () => {
    // 使用sdk发送数据
    if (sdkRef.current) {
      const data = {
        type: 'text', // 基础类型为文本
        content: value, // 包含文本内容
        attachments: [], // 包含附件
      };
      sdkRef.current.sendData(JSON.stringify(data)).then(r => {
        console.log(r);
      });
    }
  };

  return (
    <div>
      <h2>Connection State: {connectionState}</h2>
      <Input rows={3} value={value} onChange={setValue} placeholder="请输入" />
      <button onClick={handleSendMessage}>Send Data</button>

      {/!* 如果要渲染远端音视频，可以遍历 sdkRef.current?.getParticipants() *!/}
      {/!* 并把对应 track attach 到 <video> / <audio> 或其他UI *!/}
    </div>
  );
}
*/

export default () => {return <></>}
