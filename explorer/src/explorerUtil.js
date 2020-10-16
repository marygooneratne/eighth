import moment from "moment";

import { Collection, TimeSeries, TimeEvent } from "pondjs";
import aapl from "./aapl_historical.json";

export const initDataset = (name, columns, raw) => {
  const dataset = {};
  dataset.name = name;
  dataset.columns = columns;
  dataset.events = raw;
  console.log("the new set", dataset);
  return dataset;
};

Date.prototype.addDays = function (days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

export const buildPoints = (data) => {
  let points = [];
  // var fmt = "YYYY-MM-DD HH:mm";
  // var ts = new Date(Date.parse("2020-01-01, 00:00", fmt));
  console.log("sweetie", JSON.stringify(data));
  for (let p = 0; p < Object.keys(data[0].events).length; p++) {
    let arr = [];
    let time = Object.keys(data[0].events)[p];
    var day = new Date(Date.parse(time)).getDay();
    var isWeekend = day === 6 || day === 0;
    console.log("isweek", day);
    // let t1 = ts.addDays(p);
    // let time = String(t1).split(" (")[0];
    console.log("time", time);
    if (!isWeekend) {
      arr.push(time);
      // console.log(arr);
      for (let d = 0; d < data.length; d++) {
        let evts = data[d].events;

        console.log("fuck", d, Object.keys(evts));
        if (time in evts) {
          arr.push(evts[time]);
        } else {
          arr.push(NaN); //Change
        }
      }
      points.push(arr);
    }
  }
  return points;
};

export const buildCols = (data) => {
  let cols = [];
  for (let d = 0; d < data.length; d++) {
    cols.push(data[d].name);
  }
  return cols;
};

export const buildTimeEvents = (rawEvents, cols) => {
  let modEvents = rawEvents.map((item) => {
    const timestamp = moment(Date.parse(item[0]));
    let vals = {};
    for (var i = 1; i < item.length; i++) {
      vals[cols[i - 1]] = item[i];
    }
    return new TimeEvent(timestamp, vals);
  });
  const collection = new Collection(modEvents);
  const sortedCollection = collection.sortByTime();
  return sortedCollection;
};

export const buildTimeSeries = (data) => {
  let cols = buildCols(data);
  let rawEvents = buildPoints(data);
  console.log("raw", rawEvents);
  let timeEvents = buildTimeEvents(rawEvents, cols);
  return new TimeSeries({
    name: "data",
    columns: cols,
    collection: timeEvents,
  });
};

export const transformDataset = (resp) => {
  var dict = JSON.parse(resp.value);
  let raw = {};
  for (var key in dict) {
    if (dict.hasOwnProperty(key)) {
      const timestamp = moment(new Date(parseInt(key)).setHours(0, 0, 0, 0));
      raw[timestamp] = +dict[key];
    }
  }
  console.log("transformDataset", raw);
  return raw;
};

export const datasetOnLoad = () => {
  console.log("start");
  const columns = ["time", "close"];
  const name = "AAPL";
  let raw = {};
  aapl.map((item) => {
    console.log("item", item);
    const timestamp = moment(new Date(Date.parse(item.date)));
    console.log("&", item.date);
    raw[timestamp] = +item.close;
  });
  return initDataset(name + "-" + columns[1], columns, raw);
};

export const extractMoves = (events, percent, days) => {
  let vals = Object.values(events);
  let keys = Object.keys(events);
  var moves = {};

  for (var i = 0; i < keys.length - days; i++) {
    let diff = Math.abs(vals[i + days] - vals[i]);
    let target = percent * Math.abs(vals[i]);
    if (diff >= target) {
      for (var j = i; j < i + days; j++) {
        moves[keys[j]] = vals[j];
      }
      i = i + days;
    }
  }
  return moves;
};

export const cardsDataOnLoad = (dataset) => {
  console.log("dname", dataset.name);
  let dName = dataset.name;
  let copy = {};
  let root = dName.split("-")[0];
  let child = dName.split("-")[1];
  copy[root] = {};
  copy[root][child] = "0.0";
  return copy;
};
