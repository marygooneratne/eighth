import React from "react";
import "./App.css";
import { Card, Form, Button, Select, InputNumber } from "antd";
import "antd/dist/antd.css";
const { Option } = Select;

function MoveForm(props) {
  let formOptions = props.formOptions;
  let onMoveFormFinish = props.onMoveFormFinish;
  console.log(formOptions);
  const formRef = React.createRef();
  const onPercentChange = (value) => {
    // console.log("onPercentChange.value=", value)
  };
  const onDatasetChange = (value) => {
    // console.log("onDatasetChange.value=", value)
  };

  const onDaysChange = (value) => {
    // console.log("onDaysChange.value=", value)
  };

  const renderFormOptions = () => {
    return formOptions.map((name) => {
      if (name.includes("move")) {
        return null;
      } else {
        return <Option value={name}>{name}</Option>;
      }
    });
  };

  const onMoveFormSubmit = () => {
    // console.log("onMoveFormSubmit.moveFormSubmit");
  };
  return (
    <Form ref={formRef} name="control-ref" onFinish={onMoveFormFinish}>
      <Form.Item
        name="percent-change"
        label="Percent Change"
        rules={[{ required: true }]}
      >
        <InputNumber
          size={"large"}
          defaultValue={100}
          min={0}
          max={100}
          formatter={(value) => `${value}%`}
          parser={(value) => value.replace("%", "")}
          onChange={onPercentChange}
        />
      </Form.Item>
      <Form.Item
        name="num-days"
        label="Number of Days"
        rules={[{ required: true }]}
      >
        <InputNumber
          size={"large"}
          min={1}
          max={365}
          defaultValue={3}
          onChange={onDaysChange}
        />
      </Form.Item>
      <Form.Item name="dataset" label="Dataset" rules={[{ required: true }]}>
        <Select
          size={"large"}
          placeholder="Select dataset"
          onChange={onDatasetChange}
          allowClear
        >
          {renderFormOptions()}
        </Select>
      </Form.Item>
      <Form.Item>
        <Button
          size={"large"}
          type="primary"
          htmlType="Add"
          onClick={onMoveFormSubmit}
        >
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}

export default MoveForm;
