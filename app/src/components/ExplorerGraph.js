import { Chart } from 'frappe-charts/dist/frappe-charts.esm.js';
import 'frappe-charts/dist/frappe-charts.min.css';
import React, { useState } from 'react';

//import 'graphstyle.css';
import ReactFrappeChart from 'react-frappe-charts';

var earliest_date = function (dates) {
  if (dates.length == 0) return null;
  var earliestDate = dates[0];
  for (var i = 1; i < dates.length; i++) {
    var currentDate = dates[i];
    if (currentDate < earliestDate) {
      earliestDate = currentDate;
    }
  }
  return earliestDate;
};

var latest_date = function (dates) {
  if (dates.length == 0) return null;
  var latest_date = dates[0];
  for (var i = 1; i < dates.length; i++) {
    var currentDate = dates[i];
    if (currentDate > latest_date) {
      latest_date = currentDate;
    }
  }
  return latest_date;
};

var get_dict_by_name = function (name, arr) {
  for (obj in arr) {
    if (obj.keys().contains('name') && obj['name'] == name) {
      return obj;
    }
  }
  return null;
};

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

var get_dates_before = function(fullArray, stopDate) {
    var dateArray = []
    var dateIndex = 0
    while (fullArray[dateIndex] != stopDate) {
        dateArray.push(fullArray[dateIndex]);
        dateIndex++;
    }
    return dateArray;
}

var get_dates_after = function(fullArray, stopDate) {
    var dateArray = []
    var dateIndex = fullArray.length-1
    while (fullArray[dateIndex] != stopDate) {
        dateArray.push(fullArray[dateIndex]);
        dateIndex--;
    }
    return dateArray;
}

var parse_response = function(resp)  {

    var change_transform = function(org) {
        changed = org['values']
      for(i = 0; i < changed.length; i++){
          changed[i]['date'] = new Date(changed[i]['date'])
      }
      return changed
    }

    parsed = JSON.parse(resp)
    
    parsed[0]['value'] = new Date(parsed[0]['value'])
    parsed[1]['value'] = new Date(parsed[1]['value'])
    
    parsed_transforms = parsed[2]['value']
    parsed_transforms = parsed_transforms.map(transform => change_transform(transform))
    parsed[2]['value'] = parsed_transforms
    
    return parsed
}

export default function ExplorerGraph(props) {
    response = "[{'name': 'start_date', 'value':'01-01-2020'},\
    {'name': 'end_date', 'value':'01-03-2020'},\ 
    {'name': 'Transformations',\ 
    'value': [{'ticker': 'AAPL',\
                'transformation': 'Close',\
                'values':[{'date':'01-01-2020',\
                        'values':[{'Close': 345.45}]},\
                        {'date':'01-02-2020',\
                        'values':[{'Close': 325.45}]}]},\ 
            {'ticker': 'AAPL',\
            'transformation': 'Pivot Points',\ 
            'values':[{'date':'01-01-2020',\
                    'values':[{'Pivot': 345.45},\
                              {'Resistance 1': 346.71},\
                              {'Resistance 2': 348.71},\
                              {'Support 1': 343.71},\
                              {'Support 2': 341.71}]},\
                    {'date': '01-02-2020',\
                    'values':[{'Pivot': 345.45},]\
                              {'Resistance 1': 346.71},\
                              {'Resistance 2': 348.71},\
                              {'Support 1': 343.71}]}]}]"
    response = parse_response(response)
                              

  // Find earliest and latest date to extend arrays
  response = response;
  t = response[2]
  t_values = transformations['value']
  start_date = response[0]
  end_date = response[1]



  correct_start = t_values.filter(transform => (transform['values'][0]['date'] == start_date))[0]
  correct_end = t_values.filter(transform => (transform['values'][transform['values'].length-1]['date'] == end_date))[0]
  // array of dates
  full_start_date_array = correct_start[values].map(data => data['date'])
  full_end_date_array = correct_end[values].map(data => data['date'])
  // fix all arrays
  for (transform in t_values){
      full_values = transform['values']
      prepend_dates = get_dates_before(full_start_date_array, full_values['values'][0]['date'])
      for(new_date in prepend_dates){
          entry = {date: new_date, values: []}
          full_values.unshift(entry)
      }
      append_dates = get_dates_after(full_start_date_array, full_values['values'][full_values['values'].length-1]['date'])
      for(new_date in append_dates){
        entry = {date: new_date, values: []}
        full_values.push(entry)
    }
    transform['values'] = full_values //can u change array in for each loop
  }

  // Create full date array
  full_dates = response[0][values].map((full) => full[date]);
  dataset_dictionary = {};

  // Create dataset of values for each transform and subtransform
  for (response in reponses) {
    var name = response['values']['ticker'];
    for (value in response['values']['daily']['values']) {
      value_name = value.keys()[0];
      dataset_name = name + ' — ' + value_name;
      if (!dataset_dictionary.keys().contains(dataset_name))
        dataset_dictionary[dataset_name] = [];
      dataset_dictionary[dataset_name].push(value[value_name]);
    }
  }

  // Convert dictionary into dataset
  datasets = [];
  for ((key, set) in dataset_dictionary) {
    datasets.push({ name: key, chartType: 'line', values: set });
  }

  const data = {
    labels: full,

    datasets: datasets,

    yMarkers: [{ label: 'High', value: 60, options: { labelPos: 'left' } }],
  };

  return (
    <ReactFrappeChart
      data={data}
      title='APPL vs. MACD(MSFT)'
      type='axis-mixed'
      height='600'
      colors={['#25282A', '#492083', 'light-blue']}
      axisOptions={{
        xAxisMode: 'tick',
        xIsSeries: true,
      }}
      barOptions={{
        stacked: false,
        spaceRatio: 0.2,
      }}
      tooltipOptions={{
        formatTooltipX: (d) => (d + '').toUpperCase(),
        formatTooltipY: (d) => d + ' pts',
      }}
    />
  );
}
