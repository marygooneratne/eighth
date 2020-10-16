import React from "react";
import "./App.css";
import { Card, Select, Button } from "antd";
import "antd/dist/antd.css";
import { useState } from "react";
import { DATASET_MAP } from "./Constants.js";
import Form from "antd/lib/form/Form";

function Search(props) {
  const { Option } = Select;

  const [dataset, setDataset] = useState(0);
  const formRef = React.createRef();
  let onSubmit = props.onSubmit;

  const onChange = (value) => {
    setDataset(value);
    console.log(`selected ${value}`);
  };

  const handleSubmit = () => {
    onSubmit(dataset);
  };

  const onBlur = () => {
    console.log("blur");
  };

  const onFocus = () => {
    console.log("focus");
  };

  const onSearch = (val) => {
    console.log("search:", val);
  };

  return (
    <Card size="small">
      <Form ref={formRef} name="control-ref" onFinish={handleSubmit}>
        <Form.Item
          name="dataset"
          label="Dataset"
          rules={[{ required: true }]}
        ></Form.Item>
        <Form.Item>
          <Select
            showSearch
            placeholder="Select dataset"
            optionFilterProp="children"
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            onSearch={onSearch}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {DATASET_MAP.map((d) => {
              return <Option id={d.id}>{d.name}</Option>;
            })}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="Add">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
export default Search;
