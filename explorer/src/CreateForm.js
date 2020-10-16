import React from "react";
import "./App.css";
import "antd/dist/antd.css";
import { Form, Card, Select, Button, Input } from "antd";

import { useState } from "react";
import { DATASET_MAP } from "./Constants.js";
const { Option } = Select;

function CreateForm(props) {
  const [handle, setHandle] = useState(0);
  const formRef = React.createRef();
  let onSubmit = props.onSubmit;

  const onHandleChange = ({ target: { value } }) => {
    setHandle(value);
    console.log(`selected ${value}`);
  };
  const handleSubmit = (e) => {
    onSubmit(handle);
  };

  return (
    <Card>
      <Form ref={formRef} name="control-ref" onFinish={handleSubmit}>
        <Form.Item
          id="handle"
          name="handle"
          label="Handle"
          rules={[{ required: true }]}
        >
          <Input
            size={"large"}
            placeholder="Twitter Handle"
            onChange={onHandleChange}
          />
        </Form.Item>
        <Form.Item>
          <Button size={"large"} type="primary" htmlType="Add">
            Create
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}

export default CreateForm;
