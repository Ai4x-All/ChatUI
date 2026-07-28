import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { Empty } from '..';

afterEach(cleanup);

// 测试用的图片 URLs
const IMAGE_DEFAULT = '//gw.alicdn.com/imgextra/i4/O1CN01sK49rS1Wd23TqzNUM_!!6000000002810-55-tps-280-200.svg';
const IMAGE_ERROR = '//gw.alicdn.com/imgextra/i3/O1CN0189gA291s1P3ribzqY_!!6000000005706-55-tps-280-200.svg';
const IMAGE_ERROR_PERMISSION = '//gw.alicdn.com/imgextra/i3/O1CN01w3M7wn1sVAnwUCUSN_!!6000000005771-55-tps-280-200.svg';
const IMAGE_ERROR_SYSTEM = '//gw.alicdn.com/imgextra/i2/O1CN01sQpWzK1ynqeLrIzCg_!!6000000006624-55-tps-280-200.svg';
const IMAGE_ORDER = '//gw.alicdn.com/imgextra/i1/O1CN011akG1g1sB1NYoqSFz_!!6000000005727-55-tps-280-200.svg';
const IMAGE_BENEFIT = '//gw.alicdn.com/imgextra/i2/O1CN01v5pA1d1MctmYWl1jB_!!6000000001456-55-tps-280-200.svg';
const IMAGE_KNOWLEDGE = '//gw.alicdn.com/imgextra/i3/O1CN01hriild1j68c8wCq3S_!!6000000004498-55-tps-280-200.svg';
const IMAGE_CUSTOM = '//gw.alicdn.com/tfs/TB1uYH4QoY1gK0jSZFMXXaWcVXa-218-56.svg';

describe('<Empty />', () => {
  // 基础渲染测试
  describe('Rendering', () => {
    it('should render correctly with default props', () => {
      const { container } = render(<Empty />);
      const imgElement = container.querySelector('img');
      const tipElement = container.querySelector('.Empty-tip');

      expect(imgElement).toBeInTheDocument();
      expect(imgElement?.getAttribute('src')).toBe(IMAGE_DEFAULT);
      expect(tipElement).not.toBeInTheDocument();
    });

    it('should render children when provided', () => {
      const { getByTestId } = render(
        <Empty>
          <span data-testid="child-element">Child Content</span>
        </Empty>
      );

      const childElement = getByTestId('child-element');
      expect(childElement).toBeInTheDocument();
      expect(childElement).toHaveTextContent('Child Content');
    });
  });

  // 图片渲染测试
  describe('Image Rendering', () => {
    it('should render default image when no type or image specified', () => {
      const { container } = render(<Empty />);
      const imgElement = container.querySelector('img');

      expect(imgElement?.getAttribute('src')).toBe(IMAGE_DEFAULT);
    });

    it('should render custom image when image prop is provided', () => {
      const { container } = render(<Empty image={IMAGE_CUSTOM} />);
      const imgElement = container.querySelector('img');

      expect(imgElement?.getAttribute('src')).toBe(IMAGE_CUSTOM);
    });

    it('should prioritize custom image over type-based image', () => {
      const { container } = render(<Empty type="error" image={IMAGE_CUSTOM} />);
      const imgElement = container.querySelector('img');

      expect(imgElement?.getAttribute('src')).toBe(IMAGE_CUSTOM);
    });

    it('should render error image when type is "error"', () => {
      const { container } = render(<Empty type="error" />);
      const imgElement = container.querySelector('img');

      expect(imgElement?.getAttribute('src')).toBe(IMAGE_ERROR);
    });

    it('should render error_permission image when type is "error_permission"', () => {
      const { container } = render(<Empty type="error_permission" />);
      const imgElement = container.querySelector('img');

      expect(imgElement?.getAttribute('src')).toBe(IMAGE_ERROR_PERMISSION);
    });

    it('should render error_system image when type is "error_system"', () => {
      const { container } = render(<Empty type="error_system" />);
      const imgElement = container.querySelector('img');

      expect(imgElement?.getAttribute('src')).toBe(IMAGE_ERROR_SYSTEM);
    });

    it('should render order image when type is "order"', () => {
      const { container } = render(<Empty type="order" />);
      const imgElement = container.querySelector('img');

      expect(imgElement?.getAttribute('src')).toBe(IMAGE_ORDER);
    });

    it('should render benefit image when type is "benefit"', () => {
      const { container } = render(<Empty type="benefit" />);
      const imgElement = container.querySelector('img');

      expect(imgElement?.getAttribute('src')).toBe(IMAGE_BENEFIT);
    });

    it('should render knowledge image when type is "knowledge"', () => {
      const { container } = render(<Empty type="knowledge" />);
      const imgElement = container.querySelector('img');

      expect(imgElement?.getAttribute('src')).toBe(IMAGE_KNOWLEDGE);
    });
  });

  // 文案渲染测试
  describe('Text Rendering', () => {
    it('should not render tip when no tip prop is provided', () => {
      const { container } = render(<Empty />);
      const tipElement = container.querySelector('.Empty-tip');

      expect(tipElement).not.toBeInTheDocument();
    });

    it('should render tip when tip prop is provided', () => {
      const testTip = 'No data available';
      const { container } = render(<Empty tip={testTip} />);
      const tipElement = container.querySelector('.Empty-tip');

      expect(tipElement).toBeInTheDocument();
      expect(tipElement).toHaveTextContent(testTip);
    });

    it('should render description when desc prop is provided', () => {
      const testDesc = 'Please try again later';
      const { container } = render(<Empty desc={testDesc} />);
      const descElement = container.querySelector('.Empty-desc');

      expect(descElement).toBeInTheDocument();
      expect(descElement).toHaveTextContent(testDesc);
    });

    it('should render both tip and description when both props are provided', () => {
      const testTip = 'No data available';
      const testDesc = 'Please try again later';
      const { container } = render(<Empty tip={testTip} desc={testDesc} />);
      const tipElement = container.querySelector('.Empty-tip');
      const descElement = container.querySelector('.Empty-desc');

      expect(tipElement).toBeInTheDocument();
      expect(tipElement).toHaveTextContent(testTip);
      expect(descElement).toBeInTheDocument();
      expect(descElement).toHaveTextContent(testDesc);
    });
  });

  // CSS 类测试
  describe('CSS Classes', () => {
    it('should apply default CSS class', () => {
      const { container } = render(<Empty />);
      const emptyElement = container.querySelector('.Empty');

      expect(emptyElement).toBeInTheDocument();
    });

    it('should apply custom CSS class when className prop is provided', () => {
      const customClass = 'custom-empty-class';
      const { container } = render(<Empty className={customClass} />);
      const emptyElement = container.querySelector(`.Empty.${customClass}`);

      expect(emptyElement).toBeInTheDocument();
    });
  });
});