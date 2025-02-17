import React, { useEffect } from "react";
import { useRoomContext } from "@livekit/components-react";
import { RoomEvent, Participant } from "livekit-client";

interface EventListenerProps {
    onParticipantConnected?: (identity: string) => void;
    onParticipantDisconnected?: (identity: string) => void;
    onTrackSubscribed?: (track:any,publication:any,participant:any) => void;
    onParticipantAttributesChanged?: (payload:any,participant:any) => void;
    onRoomMetadataChanged?: (state:any) => void;
    // 需要什么再继续加
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
const EventListener: React.FC<EventListenerProps> = ({
                                                         onParticipantConnected,
                                                         onParticipantDisconnected,
                                                         onTrackSubscribed,
                                                         onParticipantAttributesChanged,
                                                         onRoomMetadataChanged
                                                     }) => {
    const room = useRoomContext();

    useEffect(() => {
        if (!room) return;

        // 事件处理函数
        const handleParticipantConnected = (participant: Participant) => {
            console.log("Participant connected:", participant.identity);
            // 这里不做别的，直接让外部决定怎么处理
            onParticipantConnected?.(participant.identity);
        };

        const handleParticipantDisconnected = (participant: Participant) => {
            console.log('Participant disconnected:', participant.identity);
            // 这里不做别的，直接让外部决定怎么处理
            onParticipantDisconnected?.(participant.identity);
        };

        const handleTrackSubscribed = async (track:any, publication:any, participant:any) => {
            console.log('Track subscribed:', track.name, 'by', participant.identity);
            // 这里不做别的，直接让外部决定怎么处理
            onTrackSubscribed?.(track,publication,participant);
        };

        const handleParticipantAttributesChanged = async (payload:any, participant:any) => {
            console.log('Participant AttributesChanged:agent的状态', payload,participant);
            // 这里不做别的，直接让外部决定怎么处理
            onParticipantAttributesChanged?.(payload,participant);
        }

        const handleRoomMetadataChanged = (state:string) => {
            console.log('Room MetadataChanged:Room 的状态', state);
            // 这里不做别的，直接让外部决定怎么处理
            onRoomMetadataChanged?.(state);
        }

        // 添加事件监听器
        room.on(RoomEvent.ParticipantConnected, handleParticipantConnected);
        room.on(RoomEvent.ParticipantDisconnected, handleParticipantDisconnected);
        room.on(RoomEvent.TrackSubscribed, handleTrackSubscribed);
        room.on(RoomEvent.ParticipantAttributesChanged, handleParticipantAttributesChanged);
        room.on(RoomEvent.RoomMetadataChanged, handleRoomMetadataChanged)
        // 清理
        return () => {
            room.off(RoomEvent.ParticipantConnected, handleParticipantConnected);
            room.off(RoomEvent.ParticipantDisconnected, handleParticipantDisconnected);
            room.off(RoomEvent.TrackSubscribed, handleTrackSubscribed);
            room.off(RoomEvent.ParticipantAttributesChanged, handleParticipantAttributesChanged);
            room.off(RoomEvent.RoomMetadataChanged, handleRoomMetadataChanged)
        };
    }, [room, onParticipantConnected]);

    return null; // 无需渲染任何内容
};

export default EventListener;
