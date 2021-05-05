import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import "../styles/Graph.scss";

// import PulseLoader from "react-spinners/PulseLoader";
// import axios from "axios";

import { selectCity, loadData } from "../redux/reducer";

import SeasonalChart from "../components/SeasonalChart";
import MinMaxAvgChart from "../components/MinMaxAvgChart";
import MissingChart from "../components/MissingChart";

class Graph extends Component {
  constructor() {
    super();

    this.state = {
      showSeasonal: true,
      showMinMaxAvg: false,
      showMissing: false,
      waiting: false,
      override: `
          display: block;
          margin: auto auto;
          border-color: red;
        `,
    };
  }

  updateSelected(chartName) {
    let defaultState = {
      showSeasonal: false,
      showMinMaxAvg: false,
      showMissing: false,
    };
    this.setState({
      ...defaultState,
      [chartName]: true,
    });
  }

  render() {
    let chart = null;
    if (this.state.showSeasonal) {
      chart = <SeasonalChart />;
    }
    if (this.state.showMinMaxAvg) {
      chart = <MinMaxAvgChart />;
    }
    if (this.state.showMissing) {
      chart = <MissingChart />;
    }

    return (
      <div className="Graph">
        <form className="options">
          <div className="input-container">
            <input
              onChange={() => this.updateSelected("showSeasonal")}
              checked={this.state.showSeasonal}
              name="option"
              type="radio"
              id="min-max-avg"
              className="choices"
            />
            <label>
              Compare the seasonal average as well as high and low cases
            </label>
          </div>
          <div className="input-container">
            <input
              onChange={() => this.updateSelected("showMinMaxAvg")}
              checked={this.state.showMinMaxAvg}
              name="option"
              type="radio"
              id="seasonal"
              className="choices"
            />
            <label>View the monthly average, min and max</label>
          </div>
          <div className="input-container">
            <input
              onChange={() => this.updateSelected("showMissing")}
              checked={this.state.showMissing}
              name="option"
              type="radio"
              id="missing-data"
              className="choices"
            />
            <label>See what data is projected.</label>
          </div>
        </form>
        {chart}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { city: state.city };
}

export default connect(mapStateToProps, {
  selectCity,
  loadData,
})(withRouter(Graph));
