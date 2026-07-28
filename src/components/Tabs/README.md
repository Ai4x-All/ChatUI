# tabs

# Tabs 标签页

用于让用户在不同的视图中进行切换，避免频繁跳转。

## 使用场景

*   页面内容切换
    
*   分类信息展示
    
*   多视图展示
    

## 代码演示

```plaintext
import React, { useState } from 'react';
import { Tabs, Tab } from '@chatui/core';

export default function () {
  const [tabIndex, setTabIndex] = useState(0);
  const [tabIndex2, setTabIndex2] = useState(0);

  return (
    <div className="demo-tabs">
      <h3>基础用法</h3>
      <Tabs index={tabIndex} onChange={setTabIndex}>
        <Tab label="标签1">
          <p>内容1</p>
        </Tab>
        <Tab label="标签2">
          <p>内容2</p>
        </Tab>
        <Tab label="标签3">
          <p>内容3</p>
        </Tab>
      </Tabs>

      <h3>自动滚动</h3>
      <Tabs index={tabIndex2} scrollable onChange={setTabIndex2}>
        <Tab label="标签1">
          <p>内容1</p>
        </Tab>
        <Tab label="标签2">
          <p>内容2</p>
        </Tab>
        <Tab label="标签3">
          <p>内容3</p>
        </Tab>
        <Tab label="标签4">
          <p>内容4</p>
        </Tab>
        <Tab label="标签5">
          <p>内容5</p>
        </Tab>
        <Tab label="标签6">
          <p>内容6</p>
        </Tab>
      </Tabs>
    </div>
  );
}
```

## API

### Tabs

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| className | string |  | 自定义类名 |
| index | number | `0` | 当前标签页索引值 |
| color | `primary` |  | 主题颜色 |
| size | `md` &#124; `lg` |  | 标签页大小 |
| scrollable | boolean |  | 是否可滚动 |
| hideNavIfOnlyOne | boolean |  | 只有一个标签时是否隐藏导航栏 |
| children | ReactNode |  | 子元素，通常是 Tab 组件 |
| onChange | (index: number, event: React.MouseEvent) => void |  | 标签页索引值改变时的回调 |

### Tab

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| label | string |  | 标签页标题 |
| children | ReactNode |  | 标签页内容 |