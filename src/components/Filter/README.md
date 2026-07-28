# Filter 筛选器

Filter 组件用于提供筛选功能，允许用户通过选择不同的选项来过滤数据。

## 使用场景

- 商品筛选
- 数据过滤
- 分类选择
- 多条件筛选
- 电商网站的商品属性筛选
- 内容管理系统的内容分类过滤

## 代码演示

```jsx
import React, { useState } from 'react';
import { Filter } from '@chatui/core';

const options = [
  {
    label: '红包状态',
    children: [
      { label: '可使用' },
      { label: '已使用' },
      { label: '已过期' },
    ],
  },
  {
    label: '红包面额',
    children: [
      { label: '0-10' },
      { label: '11-50' },
      { label: '51-100' },
      { label: '100以上' },
    ],
  },
];

export default function() {
  const [value, setValue] = useState({});

  return (
    <div>
      <h3>基础用法</h3>
      <Filter
        options={options}
        onChange={(value) => console.log('筛选值:', value)}
      />

      <h3>受控模式</h3>
      <Filter
        options={options}
        value={value}
        onChange={(value) => setValue(value)}
      />

      <h3>大尺寸</h3>
      <Filter
        options={options}
        size="lg"
        onChange={(value) => console.log('筛选值:', value)}
      />

      <h3>指定每行子选项个数</h3>
      <Filter
        options={options}
        itemsPerRow={2}
        onChange={(value) => console.log('筛选值:', value)}
      />
    </div>
  );
}
```

## Props

### FilterProps

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| className | string | - | 自定义类名 |
| options | FilterOption[] | `[]` | 筛选选项 |
| value | FilterValue | - | 当前选中值（受控模式） |
| size | 'md' \| 'lg' | 'md' | 尺寸大小 |
| itemsPerRow | number | 3 | 每行子选项个数 |
| scrollable | boolean | `options.length > 4` | 是否可滚动 |
| onChange | (value: FilterValue) => void | - | 筛选值变化时的回调，参数为当前选中的值对象 |

## 类型说明

### FilterOption

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| label | string | 选项标签 |
| children | FilterOption[] | 子选项（可选） |

### FilterValue

```ts
type FilterValue = Record<string, string>;
```

表示筛选值的对象，key 为选项标签，value 为选中的子选项标签。
