import { DemoPage, DemoSection } from '../components';
import { Empty, Button } from '../../../src';

export default () => (
  <DemoPage>
    <DemoSection title="基础用法">
      <Empty tip="暂无数据" />
    </DemoSection>
    <DemoSection title="网络问题">
      <Empty type="error" tip="网络拥挤，排队中" desc="待会回来再试试呢">
        <Button color="primary">刷新</Button>
      </Empty>
    </DemoSection>
    <DemoSection title="权限问题">
      <Empty type="error_permission" desc="您没有权限查看相关内容">
        <Button color="primary">申请权限</Button>
      </Empty>
    </DemoSection>
    <DemoSection title="系统问题">
      <Empty type="error_system" desc="系统正在维护中，请稍后重试">
        <Button color="primary">刷新</Button>
      </Empty>
    </DemoSection>
    <DemoSection title="订单为空">
      <Empty type="order" desc="暂无相关订单信息" />
    </DemoSection>
    <DemoSection title="权益为空">
      <Empty type="benefit" desc="暂无相关权益信息" />
    </DemoSection>
    <DemoSection title="搜索为空">
      <Empty type="search" desc="未找到相关内容，请尝试其他关键词" />
    </DemoSection>
    <DemoSection title="知识为空">
      <Empty type="knowledge" desc="暂无相关知识内容" />
    </DemoSection>
  </DemoPage>
);
