/**
 * options.js
 */
import React from "react";
import ReactDOM from "react-dom/client";
import { Switch, Button, Input, Form, message } from "antd";
import "./options.css";
import { event, storage } from "../utils/chrome-util.js";
import { eventConst } from "../consts.js";

console.log("options.js");

const formConfig = {
  name: "form",
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
  style: {
    maxWidth: 600,
    marginTop: "20px",
  },
  initialValues: {
    remember: true,
  },
  autoComplete: "off",
};

function App() {
  const [form] = Form.useForm();
  const [currentHost, setCurrentHost] = React.useState(false);

  const onFinish = async (values) => {
    console.log(values);
    let key = `${currentHost}-value`;
    await storage.set({ [key]: values.value });

    message.success("配置已保存");
  };

  async function initData() {
    event.on((message) => {
      console.log("options.js message", message);

      const { action, data } = message;
    });

    const res = await event.emitBackground({
      action: eventConst.getCurrentContentHost,
      data: {},
    });

    console.log(res);

    setCurrentHost(res.currentContentHost);
    let key = `${res.currentContentHost}-value`;
    const value = (await storage.get(key)) || "data-id";

    console.log(value);
    form.setFieldsValue({ value: value });
  }

  React.useEffect(() => {
    initData();
  }, []);

  return (
    <div className="app">
      <h2 style={{ textAlign: "center" }}>GoodDev参数设置</h2>

      <Form {...formConfig} form={form} onFinish={onFinish}>
        <Form.Item label="当前Host" name="currentHost">
          <div>{currentHost}</div>
        </Form.Item>

        <Form.Item
          label="属性"
          name="value"
          rules={[
            {
              required: true,
              message: "输入属性",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            保存
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

// 渲染到页面
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
