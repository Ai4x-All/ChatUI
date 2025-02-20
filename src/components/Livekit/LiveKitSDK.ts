// LiveKitSDK.ts
import {
  compareVersions,
  ConnectionState,
  LocalParticipant,
  Participant,
  RemoteParticipant,
  Room,
  RoomEvent,
  RpcInvocationData,
  Track,
  TrackPublication,
} from 'livekit-client';

// 声明和你之前传入 LiveKitContainer 的 Props 类似的接口
export interface LiveKitSDKOptions {
  wsUrl: string;                // 必须：信令服务器地址
  token: string;                // 必须：加入房间的token
  roomId?: string;              // 可选：房间ID
  config?: {
    camera: boolean;            // 是否开启摄像头
    mic: boolean;               // 是否开启麦克风
    [key: string]: any;
  };

  // 以下是回调（保留原有功能）
  onConnectionStateChanged?: (state: ConnectionState) => void;
  onDataReceived?: (msg: any, topic:any) => void;
  rpcMethod?: string[];
  rpcMethodCallback?: (method: string, data: RpcInvocationData) => void;

  onParticipantConnected?: (identity: string) => void;
  onParticipantDisconnected?: (identity: string) => void;
  onTrackSubscribed?: (track: Track, publication: TrackPublication, participant: Participant) => void;
  onParticipantAttributesChanged?: (payload: any, participant: Participant) => void;
  onRoomMetadataChanged?: (metadata: string) => void;
}

export class LiveKitSDK {
  private room: Room;

  private localParticipant?: LocalParticipant;

  // 可以把外部的选项保存在实例中
  private options: LiveKitSDKOptions;

  // 你可以在构造函数中直接传入 Options
  constructor(options: LiveKitSDKOptions) {
    this.options = options;
    this.room = new Room({
      adaptiveStream: true,
      dynacast: true,
      publishDefaults: {
        simulcast: true,
        dtx: true,
        red: true,
        forceStereo: false,
      },
    }); // 可以传一些 room 配置，如自动订阅设置，也可以留空

    this.handleRoomEvents();
  }

  /**
   * 连接到房间
   */
  public async connect(): Promise<void> {
    const { wsUrl, token } = this.options;
    if (!wsUrl || !token) {
      throw new Error('wsUrl 或 token 未提供');
    }

    // 连接房间
    await this.room.connect(wsUrl, token, { autoSubscribe: true });

    // 本地参与者
    this.localParticipant = this.room.localParticipant;

    // 连接成功后，根据 config 启用/关闭音视频
    const { config } = this.options;
    if (config) {
      this.localParticipant?.setCameraEnabled(config.camera);
      this.localParticipant?.setMicrophoneEnabled(config.mic);
    }

    // 如果有 rpcMethod，需要注册
    if (this.options.rpcMethod && this.options.rpcMethod.length > 0) {
      this.options.rpcMethod.forEach(method => {
        this.room?.registerRpcMethod(method, async (data: RpcInvocationData) => {
          console.log(`Received RPC call for method ${method} from ${data.callerIdentity}`);
          this.options.rpcMethodCallback?.(method, data);
          return `Hello, ${data.callerIdentity}!`; // 可根据自己需求返回
        });
      });
    }
    // 连接成功后通知外部
    this.emitConnectionState();
  }

  /**
   * 离开房间
   */
  public disconnect(): void {
    this.room.disconnect();
  }

  /**
   * 发送文本或数据到数据通道
   */
  public sendData = async (payload: any) => {
    console.log(payload);
    console.log(this.room);
    const chatMessage:any = await this.room.localParticipant.sendChatMessage(payload);
    console.log(this.room.serverInfo?.edition === 1 ||
      (!!this.room.serverInfo?.version && compareVersions(this.room.serverInfo?.version, '1.17.2') > 0));

    // 1. 创建编码器和解码器实例
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(JSON.stringify({...chatMessage, ignore:false})); // 得到 Uint8Array

    await this.room.localParticipant.publishData(encodedData, {
      reliable: true
    });
    return chatMessage;
  };

  /**
   * 设置摄像头、麦克风等
   */
  public async setCameraEnabled(enabled: boolean) {
    await this.localParticipant?.setCameraEnabled(enabled);
  }

  public async setMicrophoneEnabled(enabled: boolean) {
    await this.localParticipant?.setMicrophoneEnabled(enabled);
  }

  /**
   * 如果需要拿到 room 实例本身做更多操作，也可暴露
   */
  public getRoom(): Room {
    return this.room;
  }

  /**
   * ============== 音视频渲染相关 (多端需要自己实现 attach) ==============
   * - 这里仅示例如何监听 track 的订阅，然后 attach
   * - 如果是 React Web，可以配合 <video> <audio> 标签自行渲染
   * - 如果是移动端，需要用对应平台的渲染组件
   */

  // 例如：返回当前房间中所有 RemoteParticipant，让外部自行 attach/detach
  public getParticipants(): RemoteParticipant[] {
    return Array.from(this.room.remoteParticipants.values());
  }

  /**
   * 内部方法：处理房间的各种事件，并回调外部
   */
  private handleRoomEvents() {
    this.room.on(RoomEvent.ParticipantConnected, (participant: Participant) => {
      console.log('Participant connected:', participant.identity);
      this.options.onParticipantConnected?.(participant.identity);
    });

    this.room.on(RoomEvent.ParticipantDisconnected, (participant: Participant) => {
      console.log('Participant disconnected:', participant.identity);
      this.options.onParticipantDisconnected?.(participant.identity);
    });

    this.room.on(RoomEvent.ConnectionStateChanged, () => {
      // 每当连接状态变化时，调用外部回调
      this.emitConnectionState();
    });

    this.room.on(RoomEvent.ChatMessage, (message, participant) => {
      console.log(message, participant);
    });

    this.room.on(RoomEvent.TrackSubscribed, (track: Track, publication: TrackPublication, participant: Participant) => {
      console.log('Track subscribed:', track.kind, 'by', participant.identity);
      this.options.onTrackSubscribed?.(track, publication, participant);
    });

    this.room.on(RoomEvent.DataReceived, (payload: any, _participant: any, _kind:any,topic:any) => {
      // 与 useDataChannel 类似，在这里收到数据，然后回调出去
      this.options.onDataReceived?.(payload, topic);
    });

    this.room.on(RoomEvent.ParticipantAttributesChanged, (payload: any, participant: any) => {
      console.log('Participant AttributesChanged:', payload, participant.identity);
      this.options.onParticipantAttributesChanged?.(payload, participant);
    });

    this.room.on(RoomEvent.RoomMetadataChanged, (metadata: string) => {
      console.log('Room MetadataChanged:', metadata);
      this.options.onRoomMetadataChanged?.(metadata);
    });
  }

  private emitConnectionState() {
    if (this.options.onConnectionStateChanged) {
      const state = this.room.state; // Room.state 就是 ConnectionState
      this.options.onConnectionStateChanged(state);
    }
  }
}
