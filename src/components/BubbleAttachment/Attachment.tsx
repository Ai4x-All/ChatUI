// Attachment.tsx
import React, { useEffect, useState } from 'react';
import { FileCard } from '../FileCard';
import { Bubble } from '../Bubble';

const Attachment: React.FC<{ attachment: any, getImageUrl?: (name: string) => {},
  handleFileDetail?:(detail:any) => {} }> = ({ attachment, getImageUrl, handleFileDetail }) => {
  const [fileContent, setFileContent] = useState<JSX.Element | null>(null);

  useEffect(() => {
    if (!attachment?.object_name) return;

    const fetchFile = async () => {
      try {
        let html: JSX.Element | null = null;
        if (attachment.file_type.indexOf('image') >= 0) {
          let file = attachment.file_name;
          if (getImageUrl) {
            file = await getImageUrl(attachment.object_name);
          }

          html = (
            <Bubble type="image" key={attachment.object_name}
                    onClick={() => handleFileDetail?.(attachment)}>
              <img src={file} alt="" />
            </Bubble>
          );
        } else {
          const file = new File([attachment.file_name], attachment.file_name, {
            type: attachment.file_type,
          });
          html = <FileCard key={attachment.object_name} file={file}
                           onClick={() => handleFileDetail?.(attachment)}/>;
        }

        setFileContent(html); // 更新文件内容
      } catch (error) {
        console.error('Failed to fetch file', error);
      }
    };

    fetchFile();
  }, [attachment]);

  if (!fileContent) {
    return <div>加载中...</div>;
  }

  return fileContent;
};

export default Attachment;
