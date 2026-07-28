import React, { useState } from 'react';
import { DemoPage, DemoSection } from '../components';
import { Checkbox, CheckboxGroup, CheckboxValue } from '../../../src';

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

export default () => {
  const [value1, setValue] = useState<CheckboxValue[]>(['Apple']);
  const [value2, setValue2] = useState<CheckboxValue[]>([]);
  const [value3, setValue3] = useState<CheckboxValue[]>([]);
  const [value4, setValue4] = useState<CheckboxValue[]>([]);
  const [value5, setValue5] = useState<CheckboxValue[]>([]);
  const [value6, setValue6] = useState<CheckboxValue[]>([]);
  const [value7, setValue7] = useState<CheckboxValue[]>([]);
  const [value8, setValue8] = useState<CheckboxValue[]>([]);
  const [checked, setChecked] = useState(false);

  function handleChange(val: CheckboxValue[]) {
    setValue(val);
  }

  function handleChange2(val: CheckboxValue[]) {
    setValue2(val);
  }

  function handleChange3(val: CheckboxValue[]) {
    setValue3(val);
  }

  function handleChange4(val: CheckboxValue[]) {
    setValue4(val);
  }

  function handleChange5(val: CheckboxValue[]) {
    setValue5(val);
  }

  function handleChange6(val: CheckboxValue[]) {
    setValue6(val);
  }

  function handleChange7(val: CheckboxValue[]) {
    setValue7(val);
  }

  function handleChange8(val: CheckboxValue[]) {
    setValue8(val);
  }

  return (
    <DemoPage>
      <DemoSection title="基础用法" bg="gray">
        <Checkbox value="abc" label="ABC" checked={checked} onChange={() => setChecked(!checked)} />
      </DemoSection>
      <DemoSection title="禁用状态" bg="gray">
        <Checkbox value="abc" label="ABC" disabled />
      </DemoSection>
      <DemoSection title="复选框组" bg="gray">
        <CheckboxGroup value={value1} options={options} onChange={handleChange} />
      </DemoSection>
      <DemoSection title="块级布局（垂直排列）" bg="gray">
        <CheckboxGroup value={value2} options={options} onChange={handleChange2} block />
      </DemoSection>
      <DemoSection title="左对齐">
        <CheckboxGroup value={value3} options={options} onChange={handleChange3} align="left" />
      </DemoSection>
      <DemoSection title="右对齐">
        <CheckboxGroup value={value4} options={options} onChange={handleChange4} align="right" />
      </DemoSection>
      <DemoSection title="一行最多3个（4个选项，data-layout='3'）">
        <CheckboxGroup value={value5} options={fourOptions} onChange={handleChange5} maxPerRow={3} />
      </DemoSection>
      <DemoSection title="一行最多4个（4个选项，data-layout='4'）">
        <CheckboxGroup value={value6} options={fourOptions} onChange={handleChange6} maxPerRow={4} />
      </DemoSection>
      <DemoSection title="一行最多5个（4个选项，data-layout='5'）">
        <CheckboxGroup value={value7} options={fourOptions} onChange={handleChange7} maxPerRow={5} />
      </DemoSection>
      <DemoSection title="等分布局（4个选项，data-layout='flex'）">
        <CheckboxGroup value={value8} options={fourOptions} onChange={handleChange8} flex />
      </DemoSection>
    </DemoPage>
  );
};
