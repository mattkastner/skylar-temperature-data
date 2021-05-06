import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import mapImage from "../map-image.png";
import "../styles/Graph.scss";
import { ArrowRight } from "react-feather";

// import PulseLoader from "react-spinners/PulseLoader";
// import axios from "axios";

import { selectCity, loadData } from "../redux/reducer";

import SeasonalChart from "../components/all-cities/SeasonalChart";
import MinMaxAvgChart from "../components/all-cities/MinMaxAvgChart";
import MissingChart from "../components/all-cities/MissingChart";

class Graph extends Component {
  constructor() {
    super();

    this.state = {
      showSeasonal: true,
      showMinMaxAvg: false,
      showMissing: false,
      showMax: true,
      showMean: false,
      showMin: false,
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

  updateSelectedTempType(tempName) {
    let defaultState = {
      showMax: false,
      showMean: false,
      showMin: false,
    };
    this.setState({
      ...defaultState,
      [tempName]: true,
    });
  }

  render() {
    let tempType = "";
    if (this.state.showMax) {
      tempType = "max";
    }
    if (this.state.showMean) {
      tempType = "mean";
    }
    if (this.state.showMin) {
      tempType = "min";
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
            <label>Seasonal average as well as high and low cases</label>
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
        <form className="temp-types">
          <div className="input-container">
            {/* {this.state.showMax ? "max" : "not max"} */}
            <input
              onChange={() => this.updateSelectedTempType("showMax")}
              checked={this.state.showMax}
              name="temp-type"
              type="radio"
              id="min-max-avg"
              className="choices"
            />
            <label>Max</label>
          </div>
          <div className="input-container">
            <input
              onChange={() => this.updateSelectedTempType("showMean")}
              checked={this.state.showMean}
              name="temp-type"
              type="radio"
              id="seasonal"
              className="choices"
            />
            <label>Mean</label>
          </div>
          <div className="input-container">
            <input
              onChange={() => this.updateSelectedTempType("showMin")}
              checked={this.state.showMin}
              name="temp-type"
              type="radio"
              id="missing-data"
              className="choices"
            />
            <label>Min</label>
          </div>
        </form>

        {this.state.showSeasonal ? <SeasonalChart tempType={tempType} /> : null}

        {this.state.showMinMaxAvg ? (
          <MinMaxAvgChart tempType={tempType} />
        ) : null}

        {this.state.showMissing ? <MissingChart tempType={tempType} /> : null}
        <div
          onClick={() => this.props.history.push("/map")}
          className="map-image--container"
        >
          <img src={mapImage} className="view-map" />
          <p className="view---text">
            View map
            <ArrowRight size={20} />
          </p>
        </div>
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
