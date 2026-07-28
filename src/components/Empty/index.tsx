import React from 'react';
import clsx from 'clsx';
import { Flex } from '../Flex';
import { Image } from '../Image';

export type EmptyProps = {
  className?: string;
  type?:
    | 'error'
    | 'error_permission'
    | 'error_system'
    | 'order'
    | 'benefit'
    | 'search'
    | 'knowledge';
  image?: string;
  tip?: string;
  desc?: string;
  children?: React.ReactNode;
};

// 根据不同类型设置默认图片
const getDefaultImage = (type: EmptyProps['type']) => {
  switch (type) {
    case 'error':
      return '//gw.alicdn.com/imgextra/i3/O1CN0189gA291s1P3ribzqY_!!6000000005706-55-tps-280-200.svg';
    case 'error_permission':
      return '//gw.alicdn.com/imgextra/i3/O1CN01w3M7wn1sVAnwUCUSN_!!6000000005771-55-tps-280-200.svg';
    case 'error_system':
      return '//gw.alicdn.com/imgextra/i2/O1CN01sQpWzK1ynqeLrIzCg_!!6000000006624-55-tps-280-200.svg';
    case 'order':
      return '//gw.alicdn.com/imgextra/i1/O1CN011akG1g1sB1NYoqSFz_!!6000000005727-55-tps-280-200.svg';
    case 'benefit':
      return '//gw.alicdn.com/imgextra/i2/O1CN01v5pA1d1MctmYWl1jB_!!6000000001456-55-tps-280-200.svg';
    case 'knowledge':
      return '//gw.alicdn.com/imgextra/i3/O1CN01hriild1j68c8wCq3S_!!6000000004498-55-tps-280-200.svg';
    default:
      return '//gw.alicdn.com/imgextra/i4/O1CN01sK49rS1Wd23TqzNUM_!!6000000002810-55-tps-280-200.svg';
  }
};

export const Empty = (props: EmptyProps) => {
  const { className, type = 'search', image, tip, desc, children } = props;

  const imgUrl = image || getDefaultImage(type);

  return (
    <Flex className={clsx('Empty', className)} direction="column" center>
      <Image className="Empty-img" src={imgUrl} />
      {tip && <h5 className="Empty-tip">{tip}</h5>}
      {desc && <p className="Empty-desc">{desc}</p>}
      {children}
    </Flex>
  );
};
