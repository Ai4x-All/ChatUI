// CustomComposer.tsx
import React from 'react';
import {Composer, ComposerProps, ComposerHandle} from "../Composer";
import {FileCard} from "../FileCard"
import {Loading} from "../Loading"

export interface CustomComposerProps extends ComposerProps {
    pendingAttachments: any[];
    onDeleteAttachment: (id: string) => void;
}

export const CustomComposer = React.forwardRef<ComposerHandle, CustomComposerProps>(
    ({pendingAttachments, onDeleteAttachment, ...composerProps}, ref) => {
        return (
            <div className="custom-composer-container">
                {pendingAttachments.length > 0 && (
                    <div className="pending-attachments">
                        {pendingAttachments.map((attachment) => (
                            <div key={attachment.id} className="attachment-item">
                              {attachment.status === 'uploading' && <Loading></Loading>}
                              {attachment.type === 'image' ? (
                                <img src={attachment.file} alt={attachment.name}
                                     className="attachment-image"/>
                              ) : (
                                <FileCard className="attachment-file" file={attachment.file}/>
                              )}
                                {attachment.status === 'error' && (
                                    <div className="attachment-error">
                                        <span>上传失败</span>
                                        {/* 根据需要实现重试逻辑 */}
                                    </div>
                                )}
                                {attachment.status !== 'uploading' &&
                                    <button
                                        className="delete-attachment-button"
                                        onClick={() => onDeleteAttachment(attachment.id)}
                                        aria-label={`删除附件 ${attachment.name}`}
                                    >
                                        &times;
                                    </button>
                                }

                            </div>
                        ))}
                    </div>
                )}
                 {/*渲染受控的 Composer 输入框*/}
                <Composer
                    {...composerProps}
                    ref={ref}
                />
            </div>
        );
    }
);
