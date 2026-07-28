import React, { useState, useEffect, useRef, useCallback } from 'react';
import clsx from 'clsx';
import { Icon } from '../Icon';
import useClickOutside from '../../hooks/useClickOutside';
import { useLatest } from '../../hooks/useLatest';

interface FilterOption {
  label: string;
  // value?: string;
  // icon?: string;
  children?: FilterOption[];
}

export type FilterValue = Record<string, string>;

export interface FilterProps {
  className?: string;
  options: FilterOption[];
  value?: FilterValue;
  size?: 'md' | 'lg';
  itemsPerRow?: number;
  scrollable?: boolean;
  onChange?: (value: FilterValue) => void;
}

interface ChildOptionsProps {
  value: FilterValue;
  option: FilterOption;
  onClick: (label: string, child: FilterOption) => void;
}

const ChildOptions = ({ value, option, onClick }: ChildOptionsProps) => {
  const { label: optionLabel } = option;
  const optionValue = value[optionLabel];

  return (
    <div className="FilterChildOptions">
      {option.children!.map((child) => {
        const { label: childLabel } = child;
        return (
          <div
            key={childLabel}
            className="FilterOption"
            data-active={optionValue === childLabel}
            onClick={() => onClick(optionLabel, child)}
          >
            {childLabel}
          </div>
        );
      })}
    </div>
  );
};

export const Filter = (props: FilterProps) => {
  const {
    className,
    options = [],
    value: outerValue,
    size,
    itemsPerRow = 3,
    scrollable = options.length > 4,
    onChange,
  } = props;

  const [innerValue, setInnerValue] = useState<FilterValue>({});
  const [expandedOption, setExpandedOption] = useState<FilterOption | null>();
  const [showMask, setShowMask] = useState(false);
  const filterOptionsRef = useRef<HTMLDivElement>(null);
  const onChangeRef = useLatest(onChange);

  const isControlled = outerValue !== undefined;
  // 根据是否受控来决定使用哪个值
  const filterValue = isControlled ? outerValue : innerValue;

  const removeValue = (label: string) => {
    let newValue: FilterValue;
    if (isControlled) {
      // 受控模式下，直接从传入的 value 中删除
      const { [label]: removed, ...rest } = filterValue || {};
      newValue = rest;
    } else {
      // 非受控模式下，从内部状态中删除并更新状态
      const { [label]: removed, ...rest } = filterValue || {};
      newValue = rest;
      setInnerValue(newValue);
    }

    onChangeRef.current?.(newValue);
  };

  const updateValue = (key: string, val: string) => {
    const newValue = { ...filterValue, [key]: val };

    if (!isControlled) {
      // 非受控模式下，更新内部状态
      setInnerValue(newValue);
    }

    onChangeRef.current?.(newValue);
  };

  const closeExpandedOption = () => {
    setExpandedOption(null);
  };

  const wrapper = useClickOutside(closeExpandedOption);

  // 检查是否需要显示遮罩
  const checkMaskVisibility = useCallback(() => {
    if (filterOptionsRef.current && scrollable) {
      const { scrollLeft, scrollWidth, clientWidth } = filterOptionsRef.current;
      // 当滚动到最右边时隐藏遮罩
      const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 1;
      // 只有在内容超出容器且未滚动到最右边时才显示遮罩
      setShowMask(scrollWidth > clientWidth && !isAtEnd);
    }
  }, [scrollable]);

  useEffect(() => {
    // 初始化检查
    checkMaskVisibility();
  }, [checkMaskVisibility, scrollable]);

  const handleOptionClick = (option: FilterOption, e: React.MouseEvent<HTMLDivElement>) => {
    const { label } = option;
    const isExpanded = expandedOption?.label === label;
    const hasChildren = option.children && option.children.length > 0;

    // 滚动到中心
    if (scrollable && filterOptionsRef.current) {
      const container = filterOptionsRef.current;
      const containerWidth = container.offsetWidth;
      const target = e.currentTarget;
      const targetOffsetLeft = target.offsetLeft;
      const targetWidth = target.offsetWidth;

      const scrollLeft = targetOffsetLeft - (containerWidth - targetWidth) / 2;
      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth',
      });
    }

    if (hasChildren) {
      // 有子选项的情况
      if (isExpanded) {
        // 如果已展开，则收起
        closeExpandedOption();
      } else {
        // 如果未展开，则展开（同时收起其他选项）
        setExpandedOption(option);
      }
    } else {
      // 没有子选项的情况
      closeExpandedOption();

      if (filterValue[label]) {
        // 如果已选中，则取消选中
        removeValue(label);
      } else {
        updateValue(label, label);
      }
    }
  };

  const handleChildClick = (label: string, child: FilterOption) => {
    updateValue(label, child.label);
    closeExpandedOption();
  };

  const renderOption = (option: FilterOption) => {
    const { label } = option;
    const isExpanded = expandedOption?.label === label;
    const isSelected = !!filterValue[label];
    const hasChildren = option.children && option.children.length > 0;

    return (
      <div
        key={label}
        className="FilterOption"
        data-active={isSelected || isExpanded}
        data-expanded={isExpanded}
        onClick={(e: React.MouseEvent<HTMLDivElement>) => handleOptionClick(option, e)}
      >
        <span className="FilterOption-label">{filterValue[label] || label}</span>
        {isSelected && !isExpanded ? (
          <Icon
            type="close"
            onClick={(e: React.MouseEvent<SVGSVGElement>) => {
              removeValue(label);
              e.stopPropagation();
            }}
          />
        ) : hasChildren ? (
          <Icon type="chevron-down" />
        ) : null}
      </div>
    );
  };

  return (
    <div
      className={clsx('Filter', className)}
      data-scrollable={scrollable}
      data-expanded={!!expandedOption}
      data-size={size}
      ref={wrapper}
      style={
        {
          '--filter-child-count': itemsPerRow,
        } as React.CSSProperties
      }
    >
      <div
        className="FilterOptions"
        ref={filterOptionsRef}
        data-scrollable={scrollable}
        onScroll={checkMaskVisibility}
      >
        {options.map(renderOption)}
      </div>
      {scrollable && showMask && <div className="Filter-mask"></div>}
      {expandedOption && (
        <ChildOptions value={filterValue} option={expandedOption} onClick={handleChildClick} />
      )}
    </div>
  );
};