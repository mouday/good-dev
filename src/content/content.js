/**
 * content.js
 */

import { event, storage } from "../utils/chrome-util.js";
import { copyText } from "../utils/copy-util.js";
import { getRelativePosition } from "../utils/dom-util.js";
import { randomString } from "../utils/uuid-util.js";
import { eventConst } from "../consts.js";

console.log("content.js");

var globalId = randomString();

async function showDataId() {
  console.log("showDataId");

  const value = (await storage.get("data-id")) || "data-id";

  console.log(value);

  for (let element of [...document.querySelectorAll(`[${value}]`)]) {
    console.log(element.offsetTop, element.offsetLeft);
    element.style.position = "relative";
    element.style.border = "2px solid red";
    let attr = element.getAttribute(value);

    let position = getRelativePosition(element);

    let div = document.createElement("div");
    div.setAttribute("data-xid", globalId);
    div.innerHTML = value + ": " + attr;
    // div.style.top = position.top + "px";
    // div.style.left = position.left + "px";

    div.style.top = 0;
    div.style.left = 0;

    div.style.padding = "0 10px";
    div.style.fontSize = "14px";
    div.style.lineHeight = "1.5";
    div.style.position = "absolute";
    // div.style.zIndex = 99999;
    div.style.backgroundColor = "#1e80ff";
    div.style.color = "#fff";
    div.style.opacity = "0.6";

    div.addEventListener("click", function (e) {
      e.preventDefault();
      
      copyText(attr);
      div.innerHTML = value + ": " + attr + " copyed!";
      // alert("已复制到剪切板");
    });

    element.appendChild(div);
  }
}

function hideDataId() {
  for (let element of [
    ...document.querySelectorAll(`[data-xid='${globalId}']`),
  ]) {
    element.remove();
  }
}

const actions = {
  showDataId: showDataId,
  hideDataId: hideDataId,
};

// 入口
(() => {
  event.on((message) => {
    console.log("message", message);

    const { action, data } = message;
    if (action == eventConst.tabChange) {
      event.emit({
        action: eventConst.setCurrentContentHost,
        data: {
          currentContentHost: window.location.hostname,
        },
      });
    }
    actions[action](data);
  });

  // 将页面的host参数传递给popup
  event.emit({
    action: eventConst.setCurrentContentHost,
    data: { currentContentHost: window.location.hostname },
  });
})();

const but2 = $('<button id="cj_but2">向background发送消息</button>');
