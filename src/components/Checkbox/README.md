# Checkbox 复选框组件

Checkbox 组件用于在一组选项中选择多个选项，提供清晰的多选反馈。

## 使用场景

- 表单中的多选选择
- 设置项开关切换
- 筛选条件多选
- 问卷调查多选题
- 权限配置选择等场景

## 代码演示

```jsx
import React, { useState } from 'react';
import { Checkbox, CheckboxGroup } from '@chatui/core';

export default function() {
  const [value1, setValue1] = useState(['Apple']);
  const [value2, setValue2] = useState([]);
  const [value3, setValue3] = useState([]);
  const [value4, setValue4] = useState([]);
  const [value5, setValue5] = useState([]);
  const [value6, setValue6] = useState([]);
  const [value7, setValue7] = useState([]);
  const [value8, setValue8] = useState([]);
  const [checked, setChecked] = useState(false);

  const options = [
    { label: 'Apple', value: 'Apple' },
    { label: 'Pear', value: 'Pear', disabled: true },
    { label: 'Orange', value: 'Orange' },
    { label: 'Banana', value: 'Banana' },
  ];

  const fourOptions = [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
    { label: 'Option 3', value: '3' },
    { label: 'Option 4', value: '4' },
  ];

  return (
    <div>
      <h3>基础用法</h3>
      <Checkbox
        value="abc"
        label="ABC"
        checked={checked}
        onChange={() => setChecked(!checked)}
      />

      <h3>禁用状态</h3>
      <Checkbox value="abc" label="ABC" disabled />

      <h3>复选框组</h3>
      <CheckboxGroup
        value={value1}
        options={options}
        onChange={(val) => setValue1(val)}
      />

      <h3>块级布局（垂直排列）</h3>
      <CheckboxGroup
        value={value2}
        options={options}
        onChange={(val) => setValue2(val)}
        block
      />

      <h3>左对齐</h3>
      <CheckboxGroup
        value={value3}
        options={options}
        onChange={(val) => setValue3(val)}
        align="left"
      />

      <h3>右对齐</h3>
      <CheckboxGroup
        value={value4}
        options={options}
        onChange={(val) => setValue4(val)}
        align="right"
      />

      <h3>一行最多3个</h3>
      <CheckboxGroup
        value={value5}
        options={fourOptions}
        onChange={(val) => setValue5(val)}
        maxPerRow={3}
      />

      <h3>一行最多4个</h3>
      <CheckboxGroup
        value={value6}
        options={fourOptions}
        onChange={(val) => setValue6(val)}
        maxPerRow={4}
      />

      <h3>一行最多5个</h3>
      <CheckboxGroup
        value={value7}
        options={fourOptions}
        onChange={(val) => setValue7(val)}
        maxPerRow={5}
      />

      <h3>等分布局</h3>
      <CheckboxGroup
        value={value8}
        options={fourOptions}
        onChange={(val) => setValue8(val)}
        flex
      />
    </div>
  );
}
```

## Props

### CheckboxProps

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| className | string | - | 自定义类名 |
| value | CheckboxValue | - | 复选框的值 |
| label | ReactNode | - | 复选框的文本标签 |
| checked | boolean | false | 是否选中 |
| disabled | boolean | false | 是否禁用 |
| onChange | (event) => void | - | 变化时的回调函数 |

### CheckboxGroupProps

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| className | string | - | 自定义类名 |
| options | CheckboxProps[] | [] | 复选框选项数组 |
| value | CheckboxValue[] | [] | 当前选中的值数组 |
| name | string | - | 复选框组的 name 属性 |
| disabled | boolean | false | 是否禁用全部选项 |
| block | boolean | false | 是否块级布局（垂直排列） |
| align | `'left' \| 'right'` | - | 文本对齐方式 |
| maxPerRow | number | - | 一行最多显示的选项数量 |
| flex | boolean | false | 是否等分布局（选项均分容器宽度） |
| onChange | (value, event) => void | - | 选中值变化时的回调函数 |

## 类型定义

```typescript
type CheckboxValue = string | number | undefined;

type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  value?: CheckboxValue;
  label?: ReactNode;
};

type CheckboxGroupProps = {
  className?: string;
  options: CheckboxProps[];
  value: CheckboxValue[];
  name?: string;
  disabled?: boolean;
  block?: boolean;
  align?: 'left' | 'right';
  maxPerRow?: number;
  flex?: boolean;
  onChange: (value: CheckboxValue[], event: React.ChangeEvent<HTMLInputElement>) => void;
};
```

## 布局说明

### maxPerRow 属性

`maxPerRow` 属性用于控制一行最多显示的选项数量，通过 CSS 变量 `--max-per-row` 动态计算每个选项的宽度。

#### 示例

```jsx
// 4个选项，maxPerRow=3，会分成两行（3 + 1），每个宽度为 33.33%
<CheckboxGroup options={fourOptions} maxPerRow={3} />

// 4个选项，maxPerRow=4，刚好一行，每个宽度为 25%
<CheckboxGroup options={fourOptions} maxPerRow={4} />

// 4个选项，maxPerRow=5，一行显示，每个宽度为 20%（虽然只有4个选项）
<CheckboxGroup options={fourOptions} maxPerRow={5} />
```

### flex 属性

`flex` 属性用于开启等分布局，选项会均匀分布并占据容器的全部宽度。

- **flex 优先级高于 maxPerRow**：当同时设置 `flex` 和 `maxPerRow` 时，`flex` 生效
- **适用场景**：选项数量不固定，希望选项自动均分容器宽度

```jsx
// 4个选项，等分布局，每个选项平均占据 25% 宽度
<CheckboxGroup options={fourOptions} flex />
```

### 对齐方式

通过 `align` 属性设置文本对齐方式：

- `align="left"`：左对齐
- `align="right"`：右对齐
- 默认：居中对齐

## 样式定制

组件使用 CSS 变量 `--radio-gap` 来控制选项之间的间距，默认值为 `8px`。可以通过覆盖该变量来调整间距：

```css
.CheckboxGroup {
  --radio-gap: 12px; /* 自定义间距 */
}
```

## 注意事项

1. `CheckboxGroup` 组件的 `options` 数组中每个选项都应该有唯一的 `value` 值
2. 如果选项设置了 `disabled` 属性，会优先于 `CheckboxGroup` 的 `disabled` 属性
3. `maxPerRow` 支持任意正整数，通过 CSS 变量动态计算宽度
4. `flex` 属性优先级高于 `maxPerRow`，同时设置时 `flex` 生效
5. 使用 `block` 属性时，选项会垂直排列，不受 `maxPerRow` 和 `flex` 影响
6. `CheckboxGroup` 的 `value` 是数组类型，可以同时选中多个选项
