import React, { useCallback, useEffect, useRef, useState } from 'react';
import { DemoPage } from '../components';
import Chat, {
  Bubble,
  Button,
  Card, CardActions, CardMedia, CardText, CardTitle,
  Flex,
  FlexItem,
  Input,
  List,
  ListItem,
  LiveKitContainer,
  MessageProps, RateActions, ScrollView,
} from '../../../src';
import OrderSelector from './OrdderSelector';

export default () => {
  const [value1, setValue1] = useState('wss://lks-prod.xdforg.org:10443');
  const [value2, setValue2] = useState('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiMTc2MDAyNDIxNzkiLCJ2aWRlbyI6eyJyb29tQ3JlYXRlIjp0cnVlLCJyb29tTGlzdCI6dHJ1ZSwicm9vbVJlY29yZCI6dHJ1ZSwicm9vbUFkbWluIjp0cnVlLCJyb29tSm9pbiI6dHJ1ZSwicm9vbSI6IlJNLTJFQkMyQ0Y0QjM4QzRBNTA5MDhGOEU4QjY0RDI3ODZEIiwiY2FuUHVibGlzaCI6dHJ1ZSwiY2FuU3Vic2NyaWJlIjp0cnVlLCJjYW5QdWJsaXNoRGF0YSI6dHJ1ZX0sInN1YiI6IjE2ZDNlYTdmLThmNjYtNDc2MS1iZjI5LTExODhjMTFkZGU5MiIsImlzcyI6IkFQSVBpSzhUZkhaMTEwUCIsIm5iZiI6MTczOTkzNjg2NywiZXhwIjoxNzM5OTU4NDY3fQ.8zerO_k01Hx5xHF-6Jpc1N92Sb8l7uLSqEDNWkuZ7wM');
  const [value3, setValue3] = useState('RM-2EBC2CF4B38C4A50908F8E8B64D2786D');
  const [start, setStart] = useState(false);
  const LiveKitRef = useRef(null);
  const msgRef = React.useRef(null);

  const onDataReceived = useCallback(
    (msg: any) => {
      // console.log(msg.topic)
      if (msg.topic === 'transcription') {

      } else if (msg.topic == 'stream') {
        // console.log('stream from agent:')
        const decoded = new TextDecoder('utf-8').decode(msg.payload);
        if (decoded.startsWith('b:')) {
          const agentInfo = JSON.parse(decoded.substring(2));
          console.log('流式传输开始:', agentInfo);
        } else if (decoded.startsWith('e:')) {
          console.log('流式传输结束');
        }
        // console.log(decoded)
      } else {
        const decoded = new TextDecoder('utf-8').decode(msg.payload);
        const message = JSON.parse(decoded);
        const messageData = JSON.parse(message.message);
        console.log(messageData);
      }
    }, []);

  const onConnectionStateChanged = (state: any) => {
    console.log(state);
  };

  const startFn = () => {
    setStart(true)
  }

  const rpcMethodCallback = (method:any, data:any) => {
    console.log(method);
    console.log(data);
  }

  useEffect(() => {
    setStart(false)
  },[])

  // 发送回调
  const handleSend: any = (type: string, content: string) => {
    console.log(type);
    console.log(content);
    const newMessage: any = {
      // id: `local-${Date.now()}`, // 确保唯一 ID
      type: type, // 基础类型为文本
      content: content, // 包含文本内容
      attachments: [], // 包含附件
    };
    // @ts-ignore
    LiveKitRef.current.sendChat(JSON.stringify(newMessage)).then(res => {
      console.log(res);
    });
  };

  function renderMessageContent(msg: MessageProps) {
    const { type, content } = msg;

    // 根据消息类型来渲染
    switch (type) {
      case 'text':
        return <Bubble content={content.text} />;
      case 'guess-you':
        return (
          <Card fluid>
            <Flex>
              <div className="guess-you-aside">
                <h1>猜你想问</h1>
              </div>
              <FlexItem>
                <List>
                  <ListItem content="我的红包退款去哪里?" as="a" rightIcon="chevron-right" />
                  <ListItem content="我的红包退款去哪里?" as="a" rightIcon="chevron-right" />
                  <ListItem content="如何修改评价?" as="a" rightIcon="chevron-right" />
                  <ListItem content="物流问题咨询" as="a" rightIcon="chevron-right" />
                </List>
              </FlexItem>
            </Flex>
          </Card>
        );
      case 'skill-cards':
        return (
          <ScrollView
            className="skill-cards"
            data={[]}
            fullWidth
            renderItem={(item) => (
              <Card>
                <CardTitle>{item.title}</CardTitle>
                <CardText>{item.desc}</CardText>
              </Card>
            )}
          />
        );
      case 'order-selector':
        return <OrderSelector />;
      case 'image':
        return (
          <Bubble type="image">
            <img src={content.picUrl} alt="" />
          </Bubble>
        );
      case 'image-text-button':
        return (
          <Flex>
            <Card fluid>
              <CardMedia image="//gw.alicdn.com/tfs/TB1Xv5_vlr0gK0jSZFnXXbRRXXa-427-240.png" />
              <CardTitle>Card title</CardTitle>
              <CardText>
                如您希望卖家尽快给您发货，可以进入【我的订单】找到该笔交易，点击【提醒发货】或点击【联系卖家】与卖家进行旺旺沟通尽快发货给您哦，若卖家明确表示无法发货，建议您申请退款重新选购更高品质的商品哦商品。申请退款重新选购更高品质的商品哦商品。
              </CardText>
              <CardActions>
                <Button>次要按钮</Button>
                <Button color="primary">主要按钮</Button>
              </CardActions>
            </Card>
            <RateActions onClick={console.log} />
          </Flex>
        );
      default:
        return null;
    }
  }


  return (
    <DemoPage>
      <Input value={value3} onChange={setValue3} placeholder="请输入房间号" />
      <Input value={value1} onChange={setValue1} placeholder="请输入wss地址" />
      <Input rows={3} value={value2} onChange={setValue2} placeholder="请输入token" />
      <Button color="primary" onClick={startFn}>主要按钮</Button>

      {start && <LiveKitContainer ref={LiveKitRef}
                                  room={value3}
                                  token={value2}
                                  wsUrl={value1}
                                  onDataReceived={onDataReceived}
                                  rpcMethodCallback={rpcMethodCallback}
                                  onConnectionStateChanged={onConnectionStateChanged}>
        <Chat messages={[]} messagesRef={msgRef} onSend={handleSend}  renderMessageContent={renderMessageContent}/>
      </LiveKitContainer>}
    </DemoPage>
  );
};
