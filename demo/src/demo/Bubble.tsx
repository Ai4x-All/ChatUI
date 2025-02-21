import React from 'react';
import { DemoPage, DemoSection } from '../components';
import { Bubble } from '../../../src';
import { MessageBubble } from '../../../src';

export default () => (
  <DemoPage>
    <DemoSection title="文本气泡">
      <div className="Message left">
        <div className="Message-content">
          <Bubble type="text">
            <p>左边气泡内容</p>
          </Bubble>
        </div>
      </div>
      <div className="Message right">
        <div className="Message-content">
          <Bubble content="右边气泡内容" />
        </div>
        <div className="Message-content">
          <MessageBubble message={
            { content: "你好啊",
              createdAt: 1740103787048,
              hasTime: true,
              id: "aaf88d78-c854-48f6-aeee-c5247e70d25d",
              position: "right",
              type: "text",

              attachments:[{
                bucket_name: "room",
                file_name: "10040-10G.pdf",
                file_size: 132305,
                file_type: "application/pdf",
                object_name: "RM-FBB641FC90444FC580C62349FD4F78F1/3AB7F2DE31684EDDB569732E842540B4.pdf",
                room_name: "RM-FBB641FC90444FC580C62349FD4F78F1"
              }]
            }
          } />
        </div>
      </div>
    </DemoSection>
    <DemoSection title="图片气泡">
      <div className="Message left">
        <div className="Message-content">
          <Bubble type="image">
            <img src="https://gw.alicdn.com/tfs/TB1HURhcBCw3KVjSZR0XXbcUpXa-750-364.png" alt="" />
          </Bubble>
        </div>
      </div>
      <div className="Message right">
        <div className="Message-content">
          <Bubble type="image">
            <img src="https://gw.alicdn.com/tfs/TB1I6i2vhD1gK0jSZFsXXbldVXa-620-320.jpg" alt="" />
          </Bubble>
        </div>
      </div>
    </DemoSection>
  </DemoPage>
);
