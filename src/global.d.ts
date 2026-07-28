/**
 * 全局类型声明
 * 扩展 Window 接口以支持动态加载的全局变量
 */

declare global {
  interface Window {
    /**
     * 动态加载的脚本可能会在 window 上挂载任意全局变量
     * 通过索引签名允许访问这些动态属性
     */
    [key: string]: any;
  }
}

// 确保该文件被视为模块
export {};
