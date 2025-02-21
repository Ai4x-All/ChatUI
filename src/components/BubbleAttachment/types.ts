// components/chat/components/types.ts

export interface Attachment {
    object_name?: any;
    id: string; // 唯一标识符
    type: 'image' | 'file';
    url: string | any;
    name: string;
    file: File | any; // 新增的字段，存储原始 File 对象
    status: string;
    response?: any
}

import { MessageProps as CoreMessageProps } from '../Message';

export interface ExtendedMessageProps extends CoreMessageProps {
    attachments?: Attachment[]; // 新增字段
    id?: string; // 新增字段
    agent_name?: string; // 新增字段
    agent_id?: string; // 新增字段
}
