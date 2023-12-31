/**
 * popup.js
 */
import React from "react";
import ReactDOM from "react-dom/client";
import { Switch, Button } from "antd";
import "./popup.css";
import { event, tabs, storage } from "../utils/chrome-util.js";
import { eventConst } from "../consts.js";

function App() {
  const [checked, setChecked] = React.useState(false);
  const [currentHost, setCurrentHost] = React.useState(false);
  const [currentValue, setCurrentValue] = React.useState("");

  const onChange = (value) => {
    setChecked(value);

    if (value) {
      event.emitContent({ action: "showDataId" });
    } else {
      event.emitContent({ action: "hideDataId" });
    }

    let key = `${currentHost}-status`;
    event.emitBackground({
      action: eventConst.setCurrentContentStatus,

      data: {
        key,
        value,
      },
    });
  };

  const onClick = async () => {
    chrome.runtime.openOptionsPage();
  };

  async function initData() {
    event.on(async (message) => {
      console.log("popup.js message", message);
      const { action, data } = message;

      if (action == "onContentInit") {
        await storage.set({
          currentHost: data.currentHost,
        });
      }
    });

    const res = await event.emitBackground({
      action: eventConst.getCurrentContentHost,
      data: {},
    });

    console.log(res);

    let key = `${res.currentContentHost}-value`;
    const value = (await storage.get(key)) || "data-id";
    setCurrentValue(value);
    setCurrentHost(res.currentContentHost);

    let statusKey = `${res.currentContentHost}-status`;
    const statusRes = await event.emitBackground({
      action: eventConst.getCurrentContentStatus,

      data: {
        key: statusKey,
      },
    });

    setChecked(statusRes.value);
  }

  React.useEffect(() => {
    initData();
  }, []);

  return (
    <div className="app">
      <div className="title">GoodDev</div>

      <div style={{ marginTop: "20px" }}>当前host: {currentHost}</div>

      <div style={{ marginTop: "20px" }}>当前属性: {currentValue}</div>

      <div className="action">
        <span>隐藏属性</span>
        <Switch checked={checked} onChange={onChange} />
        <span>打开属性</span>
      </div>

      {/* 按钮 */}
      <div className="button">
        <Button type="primary" onClick={onClick}>
          设置
        </Button>
      </div>
    </div>
  );
}

// 渲染到页面
const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);
root.render(<App />);
