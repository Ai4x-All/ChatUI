import { useChat, useConnectionState, useDataChannel, useLocalParticipant } from '@livekit/components-react';
import { ConnectionState, RpcInvocationData } from 'livekit-client';
import React, { useEffect, useImperativeHandle } from 'react';

interface PlaygroundProps {
  onConnectionStateChanged?: ((state: ConnectionState) => void) | undefined,
  onDataReceived?: ((msg: any) => void) | undefined,
  LiveKitRef?: React.ForwardedRef<HTMLDivElement>,
  config?: any
  rpcMethod?: any,
  rpcMethodCallback?: (method: string, rpcMethod: any) => any
}

export default function Playground({
                                     onConnectionStateChanged,
                                     onDataReceived,
                                     LiveKitRef,
                                     config,
                                     rpcMethod,
                                     rpcMethodCallback,
                                   }: PlaygroundProps) {
  const roomState = useConnectionState();
  const { localParticipant } = useLocalParticipant();

  const { send: sendChatInternal } = useChat();

  // 1. 监听 ConnectionState，每次变化时就调用 onConnectionStateChanged
  useEffect(() => {
    if (onConnectionStateChanged) {
      onConnectionStateChanged(roomState);
    }
  }, [roomState, onConnectionStateChanged]);

  // 2. 根据外面需要，设置一些房间功能
  //   也可把外部需要的开关（比如 camera, mic）传进来，这里只做简单渲染
  useEffect(() => {
    if (roomState === ConnectionState.Connected) {
      // 假设外部不会让它做更多事情时，可以省略
      localParticipant.setCameraEnabled(config.camera);
      localParticipant.setMicrophoneEnabled(config.mic);
    }
  }, [localParticipant, roomState, config]);

  // 3. DataChannel 监听，这里只把收到的数据回调出去
  useDataChannel((msg) => {
    // msg.topic, msg.payload
    if (onDataReceived) {
      onDataReceived(msg);
    }
  });

  // 4. 如果你要用到RPC之类的，可以看你之前 Playground 里的处理
  //   同理可以把外部回调带进来
  useEffect(() => {
    if (roomState === ConnectionState.Connected) {
      rpcMethod.map((method: string) => {
        localParticipant.registerRpcMethod(
          method,
          async (data: RpcInvocationData) => {
            console.log(`Received greeting from ${data.callerIdentity}: ${data.payload}`);
            if(rpcMethodCallback){
              rpcMethodCallback(method, data)
            }
            return `Hello, ${data.callerIdentity}!`;
          },
        );
      });
    }
  }, [roomState, localParticipant]);

  // 将该方法暴露给外部
  useImperativeHandle(LiveKitRef, (): any => ({
    // 外部可调用 ref.current.sendChat("hello")，内部实际会调用 useChat() 提供的 send()
    sendChat: (text: string) => sendChatInternal(text),
  }), []);

  return <></>;
}
