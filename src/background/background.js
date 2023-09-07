/**
 * background.js
 */
import { event, storage } from "../utils/chrome-util.js";
import { eventConst } from "../consts.js";

console.log("background.js");

// 当前content域名
let currentContentHost = null;

// 全局状态
let statusData = {};

// 安装或更新
chrome.runtime.onInstalled.addListener(function (details) {
  if (details.reason == "install") {
    console.log("This is a first install!");
  } else if (details.reason == "update") {
    console.log(
      "Updated from " +
        details.previousVersion +
        " to " +
        chrome.runtime.getManifest().version +
        "!"
    );
  }
});

// 启动
chrome.runtime.onStartup.addListener(function () {
  console.log("Browser started, initialize plugin data.");
});

// 运行
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status == "complete" && tab.active) {
    console.log("Active tab updated, let's do something!");
  }
});

// 停止
chrome.runtime.onSuspend.addListener(function () {
  console.log("Browser is about to close, save plugin data.");
});

// 卸载
chrome.runtime.setUninstallURL("https://www.baidu.com/", function () {
  console.log("Uninstall URL has been set");
});

// 浏览器关闭事件
chrome.windows.onRemoved.addListener(function (windowId) {
  chrome.windows.getAll({}, function (windows) {
    if (windows.length == 0) {
      console.log("Browser is closing, the last window was closed.");
    }
  });
});

// 打开新窗口事件
chrome.windows.onCreated.addListener(function () {
  console.log("New window opened.");
});

// 关闭窗口事件
chrome.windows.onRemoved.addListener(function (windowId) {
  console.log("Window with id " + windowId + " was closed.");
});

// 切换标签页事件
chrome.tabs.onActivated.addListener(function (activeInfo) {
  console.log(activeInfo);
  //   console.log("hostname", window.location.hostname);
  console.log("Tab with id " + activeInfo.tabId + " is now active.");

  // event.emit({ action: "tabChange" });
  event.emitContent({ action: eventConst.tabChange });
});

// 点击插件图标事件
chrome.browserAction.onClicked.addListener(function (tab) {
  console.log("Plugin icon clicked in tab with id " + tab.id + ".");
});

event.on((message) => {
  console.log("background.js message", message);

  const { action, data } = message;

  if (action == "setCurrentContentHost") {
    currentContentHost = data.currentContentHost;
  }
});

/*** 通信函数*/
async function onMessage(message) {
  console.log(message);

  const { action, data } = message;

  if (action == "getCurrentContentHost") {
    return { currentContentHost };
  } else if (action == eventConst.setCurrentContentStatus) {
    statusData[data.key] = data.value;
  } else if (action == eventConst.getCurrentContentStatus) {
    return {
      key: data.key,
      value: statusData[data.key],
    };
  }
}

window.onMessage = onMessage;
