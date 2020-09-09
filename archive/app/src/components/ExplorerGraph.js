import { Chart } from "frappe-charts/dist/frappe-charts.esm.js";
import "frappe-charts/dist/frappe-charts.min.css";
import React, { useState } from "react";
import ReactFrappeChart from "react-frappe-charts";

var get_dates_before = function (fullArray, stopDate) {
  var dateArray = [];
  var dateIndex = 0;
  while (fullArray[dateIndex] < stopDate && !(dateIndex > fullArray.length)) {
    dateArray.push(fullArray[dateIndex]);
    dateIndex++;
  }
  return dateArray;
};

var get_dates_after = function (fullArray, stopDate) {
  var dateArray = [];
  var dateIndex = fullArray.length - 1;
  while (fullArray[dateIndex] > stopDate && dateIndex >= 0) {
    dateArray.push(fullArray[dateIndex]);
    dateIndex--;
  }
  return dateArray;
};

var parse_response = function (resp) {
  var change_transform = function (org) {
    var changed = org["values"];
    for (var i = 0; i < changed.length; i++) {
      changed[i]["date"] = new Date(changed[i]["date"] + "T00:00:00");
    }
    org["values"] = changed;
    return org;
  };

  var parsed = JSON.parse(resp);
  parsed[0]["value"] = new Date(parsed[0]["value"] + "T00:00:00");
  parsed[1]["value"] = new Date(parsed[1]["value"] + "T00:00:00");

  var parsed_transforms = parsed[2]["value"];
  parsed_transforms = parsed_transforms.map((transform) =>
    change_transform(transform)
  );
  parsed[2]["value"] = parsed_transforms;

  return parsed;
};

var create_blank_dict = function (key) {
  var blank = {};
  blank[key] = null;
  return blank;
};

export const ExplorerGraph = () => {
  const json =
    '[{"name": "start_date", "value":"2020-01-01"},{"name": "end_date", "value":"2020-01-04"}, {"name": "Transformations", "value": [{"ticker": "AAPL","transformation": "Close","values":[{"date":"2020-01-01","values":[{"Close": 345.45}]},{"date":"2020-01-02","values":[{"Close": 325.45}]}]},{"ticker": "AAPL","transformation": "Pivot Points", "values":[{"date":"2020-01-03","values":[{"Pivot": 31.45},{"Resistance 1": 103.71}, {"Resistance 2": 217.71},{"Support 1": 643.71},{"Support 2": 941.71}]},{"date": "2020-01-04","values":[{"Pivot": 45.45},{"Resistance 1": 446.71},{"Resistance 2": 592.71},{"Support 1": 43.71},{"Support 2": 211.71}]}]}]}]';
  // Parse and label parts of response
  var response = parse_response(json);
  var t = response[2];
  var t_values = t["value"];
  var start_date = response[0]["value"];
  var end_date = response[1]["value"];
  // Find transform with << start date and >>> end date
  var correct_start = t_values.filter(
    (transform) =>
      transform["values"][0]["date"].getTime() == start_date.getTime()
  )[0];
  var correct_end = t_values.filter(
    (transform) =>
      transform["values"][transform["values"].length - 1]["date"].getTime() ==
      end_date.getTime()
  )[0];
  // create array of dates from earliest start and array of dates from latest start
  var start_array = correct_start["values"].map((data) => data["date"]);
  var end_array = correct_end["values"].map((data) => data["date"]);

  // iterate through transforms and add empty dates to create consistent length
  for (var i = 0; i < t_values.length; i++) {
    console.log(i);
    var full_values = t_values[i]["values"];
    var prepend_dates = get_dates_before(start_array, full_values[0]["date"]);

    var blank_vals = [];
    full_values[0]["values"].map((val) =>
      blank_vals.push(create_blank_dict(Object.keys(val)[0]))
    );
    for (var date_key = prepend_dates.length - 1; date_key >= 0; date_key--) {
      var entry = { date: prepend_dates[date_key], values: blank_vals };
      full_values.unshift(entry);
    }
    var append_dates = get_dates_after(
      end_array,
      full_values[full_values.length - 1]["date"]
    );
    for (var date_key = append_dates.length - 1; date_key >= 0; date_key--) {
      var entry = { date: append_dates[date_key], values: blank_vals };
      full_values.push(entry);
    }
    console.log(full_values);
    t_values[i]["values"] = full_values; //can u change array in for each loop
  }
  response[2]["value"] = t_values;
  //split
  // Create full date array

  var full_dates = response[2]["value"][0]["values"].map(
    (full) => full["date"]
  );
  var dataset_dictionary = {};
  // {"ticker": "AAPL","transformation": "Pivot Points", "values":[{"date":"01-03-2020","values":[{"Pivot": 345.45},{"Resistance 1": 346.71},

  // // Create dataset of values for each transform and subtransform
  for (var transform_index in response[2]["value"]) {
    var transform = response[2]["value"][transform_index];
    const ticker = transform["ticker"];
    const transform_name = transform["transformation"];
    for (var day_index in transform["values"]) {
      var day = transform["values"][day_index];
      for (var value_index in day["values"]) {
        var value = day["values"][value_index];
        var value_name = Object.keys(value)[0];
        var dataset_name =
          ticker + " (" + transform_name + ")" + " — " + value_name;
        if (!Object.keys(dataset_dictionary).includes(dataset_name)) {
          dataset_dictionary[dataset_name] = [];
        }
        dataset_dictionary[dataset_name].push(value[value_name]);
      }
    }
  }
  // Convert dictionary into dataset
  var datasets = [];
  Object.keys(dataset_dictionary).forEach(function (key) {
    datasets.push({
      name: key,
      chartType: "line",
      values: dataset_dictionary[key],
    });
  });
  console.log(dataset_dictionary);
  console.log(datasets);

  const data = {
    labels: full_dates,

    datasets: datasets,

    yMarkers: [{ label: "High", value: 60, options: { labelPos: "left" } }],
  };
  return (
    <ReactFrappeChart
      data={data}
      title="APPL vs. MACD(MSFT)"
      type="axis-mixed"
      height="600"
      colors={[
        "#25282A",
        "#CB98FF",
        "#FFFFFF",
        "#60B200",
        "#D5FFA5",
        "#760AFF",
      ]}
      axisOptions={{
        xAxisMode: "tick",
        xIsSeries: true,
      }}
      barOptions={{
        stacked: false,
        spaceRatio: 0.2,
      }}
      tooltipOptions={{
        formatTooltipX: (d) => (d + "").toUpperCase(),
        formatTooltipY: (d) => d + " pts",
      }}
    />
  );
};
