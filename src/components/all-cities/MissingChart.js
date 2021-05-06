import React, { Component } from "react";
// import { connect } from "react-redux";
import ReactApexChart from "react-apexcharts";
import ApexCharts from "apexcharts";
import { withRouter } from "react-router-dom";
import axios from "axios";
import queryString from "query-string";
import moment from "moment";

import PulseLoader from "react-spinners/PulseLoader";

class MinMaxAvgChart extends Component {
  constructor() {
    super();

    this.state = {
      name: "",
      cities: {},
      waiting: false,
      tempType: "max",
      override: `
        `,
      options: {
        colors: [
          "#420420",
          "#133337",
          "#065535",
          "#c0c0c0",
          "#000000",
          "#5ac18e",
          "#dcedc1",
          "#f7347a",
          "#576675",
          "#ffc0cb",
          "#ffe4e1",
          "#008080",
          "#ffd700",
          "#e6e6fa",
          "#ff7373",
          "#00ffff",
          "#40e0d0",
          "#0000ff",
          "#d3ffce",
          "#b0e0e6",
          "#c6e2ff",
          "#003366",
          "#800080",
          "#7fffd4",
          "#20b2aa",
          "#333333",
          "#66cdaa",
          "#ff00ff",
          "#ff7f50",
          "#4ca3dd",
          "#008000",
          "#daa520",
          "#000080",
          "#bada55",
          "#7fe5f0",
          "#ff0000",
          "#ff80ed",
          "#407294",
        ],
        dataLabels: {
          enabled: false,
        },
        chart: {
          type: "area",
          animations: {
            enabled: true,
            // easing: "easeinout",
            speed: 1200,
            animateGradually: {
              enabled: false,
              delay: 0,
            },
            dynamicAnimation: {
              enabled: false,
              speed: 0,
            },
          },
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

  renderGraph = (cities) => {
    let dates = [];
    let series = [];
    let points = [];
    let xaxis = [];
    for (let city in cities) {
      cities[city].points.forEach((row) => {
        let date = new Date(row.x).getTime();
        points.push({
          ...row,
          x: date,
        });
      });
      cities[city].xaxis.forEach((row) => {
        let date = new Date(row.x).getTime();
        xaxis.push({
          ...row,
          x: date,
        });
      });
      cities[city].dates.forEach((row) => {
        dates.push(moment(row).format("l"));
      });
      break;
    }

    for (let city in cities) {
      if (this.props.tempType === "max") {
        series.push(cities[city].series[0]);
      }
      if (this.props.tempType === "mean") {
        series.push(cities[city].series[1]);
      }
      if (this.props.tempType === "min") {
        series.push(cities[city].series[2]);
      }
    }


    // let options = {
    //   ...this.state.options,
    //   xaxis: {
    //     ...this.state.options,
    //     categories: dates,
    //     tickAmount: 10,
    //   },
    //   annotations: {
    //     points,
    //     xaxis,
    //   },
    // };

    let options = {
      ...this.state.options,
      xaxis: {
        ...this.state.options.xaxis,
        categories: dates,
        tickAmount: 10,
      },
      yaxis: {
        labels: {
          formatter: function (val) {
            return val.toFixed(3) + "°C";
          },
        },
      },
      annotations: {
        points,
        xaxis,
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

  loadData = async () => {
    this.setState({
      waiting: true,
    });
    let response = await axios.put(`/api/temperature-data/missing`);
    response = response.data;

    this.setState({
      cities: response,
      waiting: false,
    });

    this.renderGraph(response)
  };

  componentDidMount() {
    this.loadData();
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
          //   <ReactApexChart
          //     options={options}
          //     series={series}
          //     type="line"
          //     height={550}
          //     width={900}
          //   />
          <div id="chart"></div>
        )}
        <br />
      </div>
    );
  }
}

export default withRouter(MinMaxAvgChart);
