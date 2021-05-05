import React, { Component } from "react";
import ApexCharts from "apexcharts";
import { withRouter } from "react-router-dom";
import axios from "axios";
import queryString from "query-string";
import moment from "moment";

import PulseLoader from "react-spinners/PulseLoader";

class MissingChart extends Component {
  constructor() {
    super();

    this.state = {
      name: "",
      temps: [],
      waiting: false,
      override: `
        `,
      options: {
        annotations: {
          points: [
            {
              x: "2015-04-11",
              y: 20.569119652,
              marker: {
                size: 8,
              },
              label: {
                borderColor: "#FF4560",
                text: "Point Annotation",
              },
            },
          ],
        },
        colors: ["#cc3333", "#545454", "#3333cc"],
        dataLabels: {
          enabled: false,
        },
        chart: {
          type: "area",
          // stacked: false,
          // height: 350,
          zoom: {
            type: "x",
            enabled: true,
            autoScaleYaxis: true,
          },
          toolbar: {
            autoSelected: "zoom",
          },
        },
        fill: {
          type: "none",
          // gradient: {
          //   shadeIntensity: 1,
          //   inverseColors: false,
          //   opacityFrom: 0.5,
          //   opacityTo: 0,
          //   stops: [0, 90, 100]
          // },
        },
        stroke: {
          // curve: "smooth",
        },
        xaxis: {
          type: "datetime",
          categories: [],
        },
        yaxis: {
          labels: {
            formatter: function (val) {
              return val.toFixed(0) + "°C";
            },
          },
        },
        tooltip: {
          x: {
            format: "dd/MM/yy",
          },
        },
      },
    };
  }

  loadData = async (name) => {
    this.setState({
      waiting: true,
    });
    let response = await axios.put(`/api/temperature-data/missing`, { name });
    response = response.data;
    console.log(response);
    this.setState({
      temps: response,
      waiting: false,
    });

    this.renderMap(response);
  };

  renderMap = (temps) => {
    let dates = [];

    let highs = [];
    let avgs = [];
    let lows = [];

    let points = [];
    console.log(temps);
    temps.forEach((row) => {
      dates.push(moment(row.location_date).format("l"));

      highs.push(row.temp_max_c);
      avgs.push(row.temp_mean_c);
      lows.push(row.temp_min_c);
      if (row.projected) {
        console.log("projecting");
        points.push({
          x: new Date(row.location_date).getTime(),
          y: row.temp_min_c,
          marker: {
            size: 5,
            fillColor: "#cc8033",
            strokeColor: "#d18d47",
            radius: 5,
          },
        });
        points.push({
          x: new Date(row.location_date).getTime(),
          y: row.temp_mean_c,
          marker: {
            size: 5,
            fillColor: "#cc8033",
            strokeColor: "#d18d47",
            radius: 5,
          },
        });
        points.push({
          x: new Date(row.location_date).getTime(),
          y: row.temp_max_c,
          marker: {
            size: 5,
            fillColor: "#cc8033",
            strokeColor: "#d18d47",
            radius: 8,
          },
          label: {
            borderColor: "black",
            text: row.location_date,
          },
        });
      }
    });

    let series = [
      {
        name: "High",
        data: highs,
      },
      {
        name: "Mean",
        data: avgs,
      },
      {
        name: "Low",
        data: lows,
      },
    ];

    // let options = {
    //   ...this.state.options,
    //   annotations: {
    //     points,
    //   },
    //   xaxis: {
    //     ...this.state.options,
    //     categories: dates,
    //     tickAmount: 10,
    //   },
    // };

    var options = {
      ...this.state.options,
      xaxis: {
        ...this.state.options.xaxis,
        categories: dates,
        tickAmount: 10,
      },
      yaxis: {
        labels: {
          formatter: function (val) {
            return val.toFixed(0) + "°C";
          },
        },
      },
      annotations: {
        points: points,
      },
      chart: {
        height: 550,
        width: 900,
        type: "line",
        // stacked: false,
        // height: 350,
        zoom: {
          type: "x",
          enabled: true,
          autoScaleYaxis: true,
        },
        toolbar: {
          autoSelected: "zoom",
        },
      },
      // dataLabels: {
      //   enabled: false,
      // },
      // stroke: {
      //   curve: "straight",
      // },
      series: series,
      title: {
        text: "Line with Annotations",
      },
      labels: dates,
      // xaxis: {
      //   type: "datetime",
      // },
    };

    var chart = new ApexCharts(document.querySelector("#chart"), options);

    chart.render();
  };

  componentDidMount() {
    const values = queryString.parse(this.props.location.search);
    this.setState({ name: values.name });
    this.loadData(values.name);
  }

  render() {
    return (
      <div
        style={{
          backgroundColor: "white",
          textAlign: "center",
        }}
      >
        <br />
        <h2>{this.state.name ? "Temperature for " + this.state.name : ""}</h2>
        <br />
        {this.state.waiting ? (
          <div className="waiting-spinner">
            <PulseLoader
              color="#2BC6CB"
              css={this.state.override}
              loading={true}
              size={20}
              margin={10}
            />
          </div>
        ) : (
          <div id="chart"></div>
        )}
        <br />
      </div>
    );
  }
}

export default withRouter(MissingChart);
