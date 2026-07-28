# Empty 空状态组件

Empty 组件用于在数据为空或加载失败时显示占位图和提示信息，提升用户体验。

## 使用场景

- 数据加载失败
- 查询结果为空
- 网络异常
- 权限不足
- 系统维护等场景

## 代码演示

```jsx
import React from 'react';
import { Empty, Button } from '@chatui/core';

export default function() {
  return (
    <div>
      <h3>基础用法</h3>
      <Empty tip="暂无数据" />

      <h3>错误状态</h3>
      <Empty type="error" tip="网络拥挤，排队中" desc="待会回来再试试呢">
        <Button color="primary">刷新</Button>
      </Empty>

      <h3>权限问题</h3>
      <Empty type="error_permission" desc="您没有权限查看相关内容">
        <Button color="primary">申请权限</Button>
      </Empty>

      <h3>系统问题</h3>
      <Empty type="error_system" desc="系统正在维护中，请稍后重试">
        <Button color="primary">刷新</Button>
      </Empty>

      <h3>订单为空</h3>
      <Empty type="order" desc="暂无相关订单信息" />

      <h3>权益为空</h3>
      <Empty type="benefit" desc="暂无相关权益信息" />

      <h3>搜索为空</h3>
      <Empty type="search" desc="未找到相关内容，请尝试其他关键词" />

      <h3>知识为空</h3>
      <Empty type="knowledge" desc="暂无相关知识内容" />

      <h3>自定义图片</h3>
      <Empty
        image="//gw.alicdn.com/tfs/TB1uYH4QoY1gK0jSZFMXXaWcVXa-218-56.svg"
        tip="自定义图片"
      />
    </div>
  );
}
```

## Props

### EmptyProps

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| className | string | - | 自定义类名 |
| type | `'error' \| 'error_permission' \| 'error_system' \| 'order' \| 'benefit' \| 'search' \| 'knowledge'` | `'search'` | 空状态类型 |
| image | string | - | 自定义图片地址 |
| tip | string | - | 提示文字 |
| desc | string | - | 描述文字 |
| children | ReactNode | - | 子元素 |

## 类型说明

| 类型 | 说明 | 默认图片 |
| --- | --- | --- |
| `error` | 错误状态 | 网络异常图标 |
| `error_permission` | 权限不足 | 权限不足图标 |
| `error_system` | 系统异常 | 系统异常图标 |
| `order` | 订单为空 | 订单为空图标 |
| `benefit` | 权益为空 | 权益为空图标 |
| `search` | 搜索为空（默认） | 搜索为空图标 |
| `knowledge` | 知识为空 | 知识为空图标 |