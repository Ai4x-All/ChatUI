# Ribbon 角标组件

Ribbon 组件用于在卡片或容器角落显示装饰性角标，常用于标识状态、类型或特殊信息。

## 使用场景

- 标识优惠券状态（如"已使用"、"即将过期"）
- 标识商品状态（如"热销"、"新品"）
- 标识内容类型（如"推荐"、"精选"）
- 标识系统状态（如"测试版"、"限时活动"）

## 代码演示

```jsx
import React from 'react';
import { Ribbon, Card } from '@chatui/core';

export default function() {
  return (
    <div>
      <h3>基础用法</h3>
      <Card style={{ position: 'relative', width: '160px', height: '80px' }}>
        <Ribbon>推荐</Ribbon>
      </Card>

      <h3>不同位置</h3>
      <Card style={{ position: 'relative', width: '160px', height: '80px' }}>
        <Ribbon position="left">居左</Ribbon>
      </Card>
      <br />
      <Card style={{ position: 'relative', width: '160px', height: '80px' }}>
        <Ribbon position="center">居中</Ribbon>
      </Card>
      <br />
      <Card style={{ position: 'relative', width: '160px', height: '80px' }}>
        <Ribbon position="right">居右</Ribbon>
      </Card>

      <h3>不同尺寸</h3>
      <Card style={{ position: 'relative', width: '160px', height: '80px' }}>
        <Ribbon size="md">中等尺寸</Ribbon>
      </Card>
      <br />
      <Card style={{ position: 'relative', width: '160px', height: '80px' }}>
        <Ribbon size="sm">小尺寸</Ribbon>
      </Card>

      <h3>不同颜色</h3>
      <Card style={{ position: 'relative', width: '160px', height: '80px' }}>
        <Ribbon color="primary">主要</Ribbon>
      </Card>
      <br />
      <Card style={{ position: 'relative', width: '160px', height: '80px' }}>
        <Ribbon color="gray">灰色</Ribbon>
      </Card>

      <h3>组合使用</h3>
      <Card style={{ position: 'relative', width: '160px', height: '80px' }}>
        <Ribbon color="primary" position="right" size="sm">推荐</Ribbon>
      </Card>
      <br />
      <Card style={{ position: 'relative', width: '160px', height: '80px' }}>
        <Ribbon color="gray" position="right" size="sm">已使用</Ribbon>
      </Card>
    </div>
  );
}
```

## Props

### RibbonProps

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| className | string | - | 自定义类名 |
| position | `'left' \| 'center' \| 'right'` | `'left'` | 角标位置 |
| size | `'sm' \| 'md'` | `'md'` | 角标尺寸 |
| color | `'primary' \| 'gray'` | `'primary'` | 角标颜色 |
| children | ReactNode | - | 角标内容 |

## 类型说明

| 类型 | 说明 |
| --- | --- |
| `position` | 控制角标显示在左上角、居中还是右上角 |
| `size` | 控制角标的字体大小，`sm` 为小尺寸，`md` 为中等尺寸 |
| `color` | 控制角标的颜色主题，`primary` 为主色，`gray` 为灰色 |
