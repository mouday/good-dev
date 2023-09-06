/**
 * https://github.com/mozilla/webextension-polyfill
 */

import browser from "webextension-polyfill";

/**
 * 事件
 */
export const event = {
  /**
   * 给content 发送消息
   * @param {*} message {action, data}
   */
  async emitContent(message) {
    const tabs = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (tabs && tabs.length > 0) {
      await browser.tabs.sendMessage(tabs[0].id, message);
    }
  },

  // 和 background.js 通信
  emitBackground(message) {
    const background = chrome.extension.getBackgroundPage();
    return background.onMessage(message);
  },
  
  async emit(message) {
    await browser.runtime.sendMessage(message);
  },

  // callback(message, sender, sendResponse)
  on(callback) {
    // 接收消息
    browser.runtime.onMessage.addListener(callback);
  },
};

/**
 * 存储
 */
export const storage = {
  async get(key) {
    const data = (await browser.storage.local.get()) || {};
    return data[key];
  },

  async set(data) {
    await browser.storage.local.set(data);
  },
};

/**
 * 获取当前 tab ID
 */
export function getCurrentTabId() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      resolve(tabs.length ? tabs[0].id : null);
    });
  });
}
