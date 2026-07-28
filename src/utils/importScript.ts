interface ImportScriptOptions {
  /** 超时时间（毫秒），0 表示不限制，默认 5000 */
  timeout?: number;
  /** 重试次数，默认 3 */
  retry?: number;
  /** 初始重试延迟（毫秒），使用指数退避策略（1s → 2s → 4s → 8s），默认 1000 */
  retryDelay?: number;
  /** 是否启用缓存，基于 url::name 键，默认 false */
  cache?: boolean;
}

// 缓存已加载的脚本 Promise
const scriptCache = new Map<string, Promise<any>>();

/**
 * 动态导入外部脚本
 * @param url 脚本地址
 * @param name 全局变量名
 * @param options 配置项
 * @returns Promise<T> 返回全局变量的值
 */
export function importScript<T>(
  url: string,
  name: string,
  options: ImportScriptOptions = {},
): Promise<T> {
  const { timeout = 5000, retry = 3, retryDelay = 1000, cache = false } = options;

  // 生成缓存键
  const cacheKey = `${url}::${name}`;

  // 检查缓存
  if (cache && scriptCache.has(cacheKey)) {
    return scriptCache.get(cacheKey)!;
  }

  // 内部加载函数,封装重试逻辑
  function attemptLoad(retriesLeft: number, currentDelay: number): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.async = true;
      script.crossOrigin = 'anonymous';

      let timeoutId: number | undefined;
      // 竞态保护：防止 Promise 被多次 resolve/reject（超时与 load/error 事件竞态）
      let isResolved = false;

      // 清理函数
      const cleanup = () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        script.onload = null;
        script.onerror = null;

        // 清理 script 标签
        // try-catch 必要：防止 script 已被其他代码删除、页面卸载等异常场景
        try {
          if (script.parentNode) {
            script.parentNode.removeChild(script);
          }
        } catch (e) {
          // 忽略清理错误
        }
      };

      // 错误处理
      const handleError = (errMsg: string) => {
        if (isResolved) return;
        isResolved = true;

        cleanup();

        // 如果还有重试次数,进行重试
        if (retriesLeft > 0) {
          // 指数退避策略：每次重试延迟时间翻倍（如 1s -> 2s -> 4s -> 8s）
          setTimeout(() => {
            attemptLoad(retriesLeft - 1, currentDelay * 2)
              .then(resolve)
              .catch(reject);
          }, currentDelay);
        } else {
          // 最后一次失败,从缓存中删除
          if (cache) {
            scriptCache.delete(cacheKey);
          }
          reject(new Error(errMsg));
        }
      };

      // 设置超时
      if (timeout > 0) {
        timeoutId = window.setTimeout(() => {
          handleError(`Script load timeout: ${url}`);
        }, timeout);
      }

      // 监听加载事件
      script.onload = () => {
        if (isResolved) return;
        isResolved = true;

        cleanup();

        const globalVar = window[name];
        if (globalVar) {
          // 删除全局变量
          try {
            delete window[name];
          } catch (e) {
            // 某些全局变量可能无法删除（如只读属性）
            window[name] = undefined;
          }

          resolve(globalVar);
        } else {
          handleError(`Script loaded but global variable "${name}" not found`);
        }
      };

      script.onerror = () => {
        handleError(`Failed to load script: ${url}`);
      };

      // 添加到 DOM
      document.head.appendChild(script);
    });
  }

  // 创建加载 Promise
  const loadPromise = attemptLoad(retry, retryDelay);

  // 存入缓存
  if (cache) {
    scriptCache.set(cacheKey, loadPromise);
  }

  return loadPromise;
}
