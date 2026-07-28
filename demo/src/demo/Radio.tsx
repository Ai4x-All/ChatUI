import React, { useState } from 'react';
import { DemoPage, DemoSection } from '../components';
import { Radio, RadioGroup, RadioValue } from '../../../src';

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
  const [value, setValue] = useState<RadioValue>('a');
  const [value2, setValue2] = useState<RadioValue>('Apple');
  const [value3, setValue3] = useState<RadioValue>('Apple');
  const [value4, setValue4] = useState<RadioValue>('Apple');
  const [value5, setValue5] = useState<RadioValue>('1');
  const [value6, setValue6] = useState<RadioValue>('1');
  const [value7, setValue7] = useState<RadioValue>('1');
  const [value8, setValue8] = useState<RadioValue>('1');

  function handleChange(val: RadioValue) {
    setValue(val);
  }

  function handleChange2(val: RadioValue) {
    setValue2(val);
  }

  function handleChange3(val: RadioValue) {
    setValue3(val);
  }

  function handleChange4(val: RadioValue) {
    setValue4(val);
  }

  function handleChange5(val: RadioValue) {
    setValue5(val);
  }

  function handleChange6(val: RadioValue) {
    setValue6(val);
  }

  function handleChange7(val: RadioValue) {
    setValue7(val);
  }

  function handleChange8(val: RadioValue) {
    setValue8(val);
  }

  return (
    <DemoPage>
      <DemoSection title="基础用法" bg="gray">
        <Radio label="备选项A" value="a" />
        <Radio label="备选项B" value="b" checked />
        <Radio label="备选项C" value="c" disabled />
      </DemoSection>
      <DemoSection title="单选框组" bg="gray">
        <RadioGroup value={value} options={options} onChange={handleChange} />
      </DemoSection>
      <DemoSection title="左对齐">
        <RadioGroup value={value2} options={options} onChange={handleChange2} align="left" />
      </DemoSection>
      <DemoSection title="右对齐">
        <RadioGroup value={value3} options={options} onChange={handleChange3} align="right" />
      </DemoSection>
      <DemoSection title="块级布局（垂直排列）">
        <RadioGroup value={value4} options={options} onChange={handleChange4} block />
      </DemoSection>
      <DemoSection title="一行最多3个（4个选项，data-layout='3'）">
        <RadioGroup value={value5} options={fourOptions} onChange={handleChange5} maxPerRow={3} />
      </DemoSection>
      <DemoSection title="一行最多4个（4个选项，data-layout='4'）">
        <RadioGroup value={value6} options={fourOptions} onChange={handleChange6} maxPerRow={4} />
      </DemoSection>
      <DemoSection title="一行最多5个（4个选项，data-layout='5'）">
        <RadioGroup value={value7} options={fourOptions} onChange={handleChange7} maxPerRow={5} />
      </DemoSection>
      <DemoSection title="等分布局（4个选项，data-layout='flex'）">
        <RadioGroup value={value8} options={fourOptions} onChange={handleChange8} flex />
      </DemoSection>
    </DemoPage>
  );
};
