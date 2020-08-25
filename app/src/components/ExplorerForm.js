import React, { useState } from "react";
import { Form, Button, Select, DatePicker } from "antd";

import "antd/dist/antd.css";

export const ExplorerForm = () => {
  const [componentSize, setComponentSize] = useState("default");

  const onFormLayoutChange = ({ size }) => {
    setComponentSize(size);
  };
  const { RangePicker } = DatePicker;

  return (
    <Form layout="horizontal" onValuesChange={onFormLayoutChange}>
      <Form.Item>
        <RangePicker style={{ width: "100%" }} />
      </Form.Item>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Form.Item>
          <Select placeholder="Select a transformation">
            <Select.Option value="demo">Demo</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Select placeholder="Select an equity">
            <Select.Option value="demo">Demo</Select.Option>
          </Select>
        </Form.Item>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-between",
          flex: 1,
        }}
      >
        <Form.Item>
          <Select placeholder="Select a transformation" style={{ flex: 1 }}>
            <Select.Option value="demo">Demo</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Select placeholder="Select an equity" style={{ flex: 1 }}>
            <Select.Option value="demo">Demo</Select.Option>
          </Select>
        </Form.Item>
      </div>
      <Form.Item>
        <Button style={{ backgroundColor: "#B3DE74", width: "100%" }}>
          Explore relationship
        </Button>
      </Form.Item>
    </Form>
  );
};
