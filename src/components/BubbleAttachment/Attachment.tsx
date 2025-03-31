// Attachment.tsx
import React, { useEffect, useState } from 'react';
import { FileCard } from '../FileCard';
import { Bubble } from '../Bubble';

const Attachment: React.FC<{ attachment: any, getImageUrl?: (name: string) => {},
  handleFileDetail?:(detail:any) => {} }> = ({ attachment, getImageUrl, handleFileDetail }) => {
  const [fileContent, setFileContent] = useState<JSX.Element | null>(null);

  // 下载
  const download = async (file:any) => {
    const url:any = await getImageUrl?.(file.object_name); // 获取 Blob 数据
    // eslint-disable-next-line compat/compat

    const a = document.createElement("a");
    a.href = url;
    a.download = file.file_name; // 直接指定文件名

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    // eslint-disable-next-line compat/compat
    window.URL.revokeObjectURL(url);
  }

  // 点击文件查看 详情
  const fileDetail= async (detail:any)=> {
    console.log('文件detail')
    console.log(detail)
    if (!handleFileDetail) return;
    // 判断文件类型
    function checkFileType(filename:any) {
      const pdfPattern = /\.pdf$/i;
      const imagePattern = /\.(jpe?g|png|gif|bmp|webp)$/i;
      const officePattern = /\.(docx?|xlsx?|pptx?)$/i;

      if (pdfPattern.test(filename)) return "PDF";
      if (imagePattern.test(filename)) return "Image";
      if (officePattern.test(filename)) return "Office";
      return "Unknown";
    }
    if (checkFileType(detail.object_name) !== 'Unknown') {
      const url = await getImageUrl?.(detail.object_name)
      const obj = {
        FunctionName: 'ShowFile',
        url,
        file_type: detail.file_type,
      }
      handleFileDetail?.(obj)
    }else {
      message.error('暂不支持预览')
    }

  }



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
                    style={{background: 'transparent', textAlign: 'right'}}>
              <img onClick={() => fileDetail(attachment)} src={file} alt="" />
              <a onClick={() => download(attachment)}>下载</a>
            </Bubble>
          );
        } else {
          const file = new File([attachment.file_name], attachment.file_name, {
            type: attachment.file_type
          });
          html = <FileCard key={attachment.object_name} file={file}>
            <a onClick={() => fileDetail(attachment)}>查看</a>
            <a onClick={() => download(attachment)}>下载</a>
          </FileCard>;
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
