const ua = navigator.userAgent;
// 判断是否处于微信小程序环境
export const isWxEnv = typeof window !== 'undefined' && window.__wxjs_environment === 'miniprogram';

// export const isIOS = /iPad|iPhone|iPod/.test(ua);
let ios = /iPad|iPhone|iPod/.test(ua);
// 针对 iOS 的判断：如果在微信小程序中，建议使用 wx.getSystemInfoSync 获取
if (isWxEnv) {
  const urlParams = new URLSearchParams(window.location.search);
  const platform = urlParams.get('platform');
  ios = !!(platform && platform === 'ios');
}
export const isIOS = ios;

export const isSafari = /^((?!chrome|android|crios|fxios).)*safari/i.test(ua);

export const isSafariOrIOS11 = ua.includes('Safari/') || /OS 11_[0-3]\D/.test(ua);

export function getIOSMajorVersion() {
  const v = ua.match(/OS (\d+)_/);
  return v ? +v[1] : 0;
}

export const isArkWeb = ua.includes('ArkWeb');

export const isHuaweiBrowser = ua.includes('HuaweiBrowser/');

export const isAliApp = ua.includes('AliApp');
