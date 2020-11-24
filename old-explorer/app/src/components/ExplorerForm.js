import React, { useState } from "react";
import { Form, Button, Select, DatePicker } from "antd";
import "antd/dist/antd.css";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

export const ExplorerForm = () => {
  const [state, setState] = useState({ data: {}, size: 0 });
  const onFinish = (values) => {
    var startDate = values.startDate._d;
    var startFormatted =
      startDate.getFullYear() +
      "-" +
      ("0" + (startDate.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + startDate.getDate()).slice(-2);

    var endDate = values.endDate._d;
    var endFormatted =
      endDate.getFullYear() +
      "-" +
      ("0" + (endDate.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + endDate.getDate()).slice(-2);

    var ticker = values.ticker;
    var transformation = values.transformation;

    var transformations = [{ ticker: ticker, transformation: transformation }];

    var data = {
      startDate: startFormatted,
      endDate: endFormatted,
      transformations: transformations,
    };

    console.log("Received values of form: ", data);

    const url = "http://localhost:5000/explore";
    var responseData = {};
    fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((res) => setState({ name: res.data }));
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const onFormLayoutChange = ({ size }) => {
    setState({ size: size });
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
        <Form.Item name="transformation">
          <Select placeholder="Select a transformation">
            <Select.Option value="demo">Demo</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="equity">
          <Select placeholder="Select an equity">
            <Select.Option value="demo">Demo</Select.Option>
          </Select>
        </Form.Item>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          flex: 1,
        }}
      >
        <Form.Item name="transformation">
          <Select placeholder="Select a transformation" style={{ flex: 1 }}>
            <Select.Option value="demo">Demo</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="equity">
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
      <p>{state.data}</p>
    </Form>
  );
};
