import React, { Component } from "react";
// import { connect } from "react-redux";
import ReactApexChart from "react-apexcharts";
import { withRouter } from "react-router-dom";
import axios from "axios";
import queryString from "query-string";
import moment from "moment"

import PulseLoader from "react-spinners/PulseLoader";

class SeasonalChart extends Component {
  constructor() {
    super();

    this.state = {
      name: "",
      temps: [],
      waiting: false,
      override: `
        `,
      options: {
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
    let response = await axios.put(`/api/temperature-data/seasonal`, { name });
    response = response.data;

    this.setState({
      temps: response,
      waiting: false,
    });
  };

  componentDidMount() {
    const values = queryString.parse(this.props.location.search);
    this.setState({ name: values.name });
    this.loadData(values.name);
  }

  render() {
    let dates = [];

    let highs = [];
    let seasonal = [];
    let lows = [];

    this.state.temps.forEach((row) => {
      dates.push(moment(row.location_date).format('l'));

      highs.push(row.temp_max_c);
      seasonal.push(+row.seasonal);
      lows.push(row.temp_min_c);
    });

    let options = {
      ...this.state.options,
      xaxis: {
        ...this.state.options,
        categories: dates,
        tickAmount: 10,
      },
    };

    let series = [
      {
        name: "High",
        data: highs,
      },
      {
        name: "Seasonal",
        data: seasonal,
      },
      {
        name: "Low",
        data: lows,
      },
    ];

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
          <ReactApexChart
            options={options}
            series={series}
            type="line"
            height={550}
            width={900}
          />
        )}
        <br />
      </div>
    );
  }
}

export default withRouter(SeasonalChart);
