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

  return (
    <Form
      labelCol={{
        span: 4,
      }}
      wrapperCol={{
        span: 14,
      }}
      layout="horizontal"
      initialValues={{
        size: state.size,
        remember: true,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      onValuesChange={onFormLayoutChange}
      size={state.size}
    >
      <Form.Item name="startDate" label="DatePicker">
        <DatePicker />
      </Form.Item>
      <Form.Item name="endDate" label="DatePicker">
        <DatePicker />
      </Form.Item>
      <Form.Item name="ticker" label="Select">
        <Select>
          <Select.Option value="AAPL">AAPL</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item name="transformation" label="Select">
        <Select>
          <Select.Option value="sma">Simple Moving Average</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
      <p>{state.data}</p>
    </Form>
  );
};
