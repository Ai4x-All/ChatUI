import React from 'react';
import { LiveKitRoom, RoomAudioRenderer, StartAudio } from '@livekit/components-react';
import '@livekit/components-styles';
import { ConnectionState } from 'livekit-client';

// eslint-disable-next-line @typescript-eslint/no-redeclare
import EventListener from './EventListener';
import Playground from './Playground'; // 即原 RoomContext.tsx

export interface LiveKitContainerProps {
  wsUrl: string;
  token: string;
  room: string;
  style?: any;
  className?: any;
  children?: React.ReactNode;
  config?: any, // 房间配置项
  // 这里放各种外部回调
  // 根据自己需要定义，比如 onDataReceived, onParticipantConnected, onConnectionStateChanged ...
  onDataReceived?: (msg: any) => void;
  rpcMethod?: [];
  rpcMethodCallback?: (method: string, rpcMethod: any) => void;
  onConnectionStateChanged?: (state: ConnectionState) => void;
  onParticipantConnected?: (identity: string) => void;
  onParticipantDisconnected?: (identity: string) => void;
  onTrackSubscribed?: (track: any, publication: any, participant: any) => void;
  onParticipantAttributesChanged?: (payload: any, participant: any) => void;
  onRoomMetadataChanged?: (state: any) => void;
  // ...
  [key: string]: any;
}

export const LiveKitContainer = React.forwardRef<HTMLDivElement, LiveKitContainerProps>((props, ref) => {
  const {
    wsUrl,
    token,
    room,
    style = {},
    className = {},
    config = {
      camera: 0,
      mic: 0,
    },
    onDataReceived,
    rpcMethod=['command'],
    rpcMethodCallback,
    onConnectionStateChanged,
    onParticipantConnected,
    onParticipantDisconnected,
    onTrackSubscribed,
    onParticipantAttributesChanged,
    onRoomMetadataChanged,
    children,
    ...otherProps
  } = props;

  return (
    <>
      {token ? (
        // @ts-ignore
        <LiveKitRoom
          {...otherProps}
          style={style}
          className={className}
          ref={ref}
          key={room}
          token={token}
          serverUrl={wsUrl}
          connectOptions={{ autoSubscribe: true }}
        >
          {/* 事件监听器组件，里面监听 participantConnected 等事件 */}
          {/* 可以把回调写在组件内部，然后再从 props 里调用外面的 onParticipantConnected */}
          <EventListener
            onParticipantConnected={onParticipantConnected}
            onParticipantDisconnected={onParticipantDisconnected}
            onRoomMetadataChanged={onRoomMetadataChanged}
            onTrackSubscribed={onTrackSubscribed}
            onParticipantAttributesChanged={onParticipantAttributesChanged} />
          <RoomAudioRenderer />
          {/*@ts-ignore*/}
          <StartAudio label="点击以启用音频" />
          <Playground LiveKitRef={ref}
                      config={config}
                      onConnectionStateChanged={onConnectionStateChanged}
                      onDataReceived={onDataReceived}
                      rpcMethod={rpcMethod}
                      rpcMethodCallback={rpcMethodCallback} />
          {children}
        </LiveKitRoom>
      ) : (
        <>连接中</>
      )}
    </>
  );
});

