import { useState } from 'react';
import { DemoPage, DemoSection } from '../components';
import { Filter } from '../../../src';
import type { FilterValue } from '../../../src';

const options1 = [
  {
    label: '红包状态',
    children: [
      {
        label: '可使用',
      },
      {
        label: '已使用',
      },
      {
        label: '已过期',
      },
    ],
  },
  {
    label: '红包面额',
    children: [
      {
        label: '0-10',
      },
      {
        label: '11-50',
      },
      {
        label: '51-100',
      },
      {
        label: '100以上',
      },
    ],
  },
];

const options2 = [
  {
    label: '有降价',
  },
  {
    label: '宝贝分类',
    children: [
      {
        label: '女装',
      },
      {
        label: '男装',
      },
      {
        label: '鞋靴',
      },
      {
        label: '美妆',
      },
      {
        label: '洗护',
      },
      {
        label: '配饰',
      },
      {
        label: '其它',
      },
    ],
  },
  {
    label: '宝贝状态',
    children: [
      {
        label: '已买过',
      },
      {
        label: '低库存',
      },
      {
        label: '已失效',
      },
      {
        label: '未失效',
      },
    ],
  },
  {
    label: '收藏时间',
    children: [
      {
        label: '7天内',
      },
      {
        label: '30天内',
      },
      {
        label: '90天内',
      },
      {
        label: '半年前',
      },
      {
        label: '一年前',
      },
    ],
  },
  {
    label: '宝贝排序',
    children: [
      {
        label: '最近收藏在前',
      },
      {
        label: '最早收藏在前',
      },
    ],
  },
];

export default () => {
  const [filterValue, setFilterValue] = useState<FilterValue>({ 红包面额: '51-100' });

  const handleFilterChange = (value: FilterValue) => {
    console.log('筛选值:', value);
    setFilterValue(value);
  };

  return (
    <DemoPage>
      <DemoSection title="基础用法">
        <Filter options={options1} onChange={(value) => console.log('筛选值:', value)} />
      </DemoSection>
      <DemoSection title="不同尺寸 - 大尺寸">
        <Filter options={options1} size="lg" onChange={(value) => console.log('筛选值:', value)} />
      </DemoSection>
      <DemoSection title="受控模式">
        <Filter
          options={options1}
          value={filterValue}
          onChange={handleFilterChange}
        />
      </DemoSection>
      <DemoSection title="超多可滑动">
        <Filter options={options2} onChange={(value) => console.log('筛选值:', value)} />
      </DemoSection>
      <DemoSection title="指定每行子选项个数">
        <Filter options={options2} itemsPerRow={2} onChange={(value) => console.log('筛选值:', value)} />
      </DemoSection>
    </DemoPage>
  );
};