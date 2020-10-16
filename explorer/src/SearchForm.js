import React from "react";
import "./App.css";
import "antd/dist/antd.css";
import { Form, Card, Select, Button } from "antd";

import { useState } from "react";
import { DATASET_MAP } from "./Constants.js";
const { Option } = Select;

function SearchForm(props) {
  const [dataset, setDataset] = useState(0);
  const [col, setCol] = useState(0);
  const formRef = React.createRef();
  let onSubmit = props.onSubmit;

  const onChange = (value) => {
    setDataset(value);
    console.log(`selected ${value}`);
  };
  const onColumnChange = (value) => {
    setCol(value);
    console.log(`selected ${value}`);
  };

  const handleSubmit = () => {
    onSubmit(dataset, col);
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

  const renderCols = () => {
    var find = [];
    if (dataset != 0) {
      find = DATASET_MAP.filter((d) => {
        return d.id == dataset;
      });
      find = find[0];
      return find.cols;
    } else return [];
  };

  return (
    <Form ref={formRef} name="control-ref" onFinish={handleSubmit}>
      <Form.Item name="dataset" label="Dataset" rules={[{ required: true }]}>
        <Select
          size={"large"}
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
            return <Option value={d.id}>{d.name}</Option>;
          })}
        </Select>
      </Form.Item>

      <Form.Item name="column" label="Column" rules={[{ required: true }]}>
        <Select
          size={"large"}
          showSearch
          placeholder="Select column"
          optionFilterProp="children"
          onChange={onColumnChange}
          onFocus={onFocus}
          onBlur={onBlur}
          onSearch={onSearch}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {renderCols().map((c) => {
            return <Option value={c}>{c}</Option>;
          })}
          ;
        </Select>
      </Form.Item>
      <Form.Item>
        <Button size={"large"} type="primary" htmlType="Add">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}

export default SearchForm;
