// CustomComposer.tsx
import React from 'react';
import { Composer, ComposerHandle, ComposerProps } from '../Composer';
import { FileCard } from '../FileCard';
import { Loading } from '../Loading';

export interface CustomComposerProps extends ComposerProps {
  tipsData?: any[];
  pendingAttachments: any[];
  onDeleteAttachment: (id: string) => void;
}

export const CustomComposer = React.forwardRef<ComposerHandle, CustomComposerProps>(
  ({ pendingAttachments, onDeleteAttachment, tipsData = [], ...composerProps }, ref) => {

    return (
      <>
        {tipsData.length ? <div className="tips">{tipsData[0].message}</div> : null}

        <div className="custom-composer-container">
            {pendingAttachments.length > 0 && (
              <div className="pending-attachments">
                {pendingAttachments.map((attachment) => (
                  <div key={attachment.id} className="attachment-item">
                    {attachment.status === 'uploading' && <Loading></Loading>}
                    {attachment.type === 'image' ? (
                      <img src={attachment.file} alt={attachment.name}
                           className="attachment-image" />
                    ) : (
                      <FileCard className="attachment-file" file={attachment.file} />
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
            <p className="custom-composer-tip">智能体也可能会犯错，请核查重要信息。</p>
          </div>
      </>
    );
    }
);
