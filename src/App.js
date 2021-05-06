import "./styles/App.scss";

import React, { Component } from "react";
import { RefreshCcw, ArrowLeft } from "react-feather";
import { connect } from "react-redux";
import axios from "axios";
import { withRouter } from "react-router-dom";

import routes from "./routes";
import { updateCities, updateLocations } from "./redux/reducer";

// import moment from "moment";

import Header from "./components/Header";

class App extends Component {
  constructor() {
    super();
    this.state = {
      waiting: false,
      temperatureData: [],
      locations: [],
    };
  }

  refreshData = async () => {
    let response = await axios.get("/api/temperature-data");
    // console.log(response.data.data);
    let cities = {};
    response.data.data.forEach((row) => {
      if (cities[row.name] !== undefined) {
        cities[row.name].push(row);
      } else {
        cities[row.name] = [row];
      }
    });
    console.log(cities)
  };

  render() {
    return (
      <div className="App">
        <Header></Header>
        <div className="content-body">
          <div className="map-wrapper">
            {this.props.location.pathname.includes("graph") ? (
              <div className="left-map-infomation">
                <button
                  className="back"
                  disabled={this.state.waiting}
                  onClick={() => this.props.history.push("/map")}
                >
                  <ArrowLeft color="#2BC6CB" size={20} />
                </button>
                <div className="title">
                  {/* <h4>{this.props.city.name}</h4> */}
                </div>
              </div>
            ) : null}
            {routes}
            <button
              disabled={this.state.waiting}
              onClick={this.refreshData}
              className="refresh-circle"
            >
              <RefreshCcw color="#2BC6CB" size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { city: state.city };
}

export default connect(mapStateToProps, { updateCities, updateLocations })(
  withRouter(App)
);
