import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import axios from "axios";
import { ArrowLeft } from "react-feather";

import "../styles/MapChart.scss";

import PulseLoader from "react-spinners/PulseLoader";

import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";

class MapChart extends Component {
  constructor() {
    super();
    this.state = {
      wait: true,
      name: "",
      locations: [],
      unmarkedLocations: [],
      override: `
          display: block;
          margin: auto auto;
          border-color: red;
        `,
      waiting: true,
      geoUrl:
        "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json",
    };
  }

  getMapData = async () => {
    let response = await axios.get("/api/temperature-data/locations");
    let locations = response.data.data;

    let unmarkedLocations = [];
    // console.log(locations);
    unmarkedLocations = locations.filter((city) => !city.Lat);
    locations = locations.map((city) => {
      return {
        markerOffset: 25,
        name: city.name,
        coordinates: [city.Lon, city.Lat],
      };
    });
    // // console.log(unmarkedLocations);
    this.setState({ locations, unmarkedLocations });
    this.setState({ waiting: false });
  };

  selectCity = (name) => {
    this.props.history.push(`/graph?name=${name}`);
  };

  componentWillMount() {
    this.getMapData();
  }

  render() {
    let locations = [...this.state.locations];
    return (
      <>
        {this.state.waiting ? (
          <PulseLoader
            color="#2BC6CB"
            css={this.state.override}
            loading={true}
            size={20}
            margin={10}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", position: "relative" }}>
            <select
              onChange={(e) =>
                this.props.history.push(`graph?name=${e.target.value}`)
              }
              defaultValue="unmarked"
              className="no-location-pin"
            >
              <option value="unmarked" disabled hidden>
                Selected an unmarked city
              </option>

              {this.state.unmarkedLocations.map((location) => (
                <option key={location.name} value={location.name}>
                  {location.name}
                </option>
              ))}
            </select>
            <button
              onClick={() => this.props.history.push("/")}
              className="return-to-all"
            >
              <ArrowLeft color="#2BC6CB" size={20} />
            </button>
            <ComposableMap
              style={{ background: "#2BC6CB", height: "100%", width: "100%" }}
              projection="geoAzimuthalEqualArea"
              projectionConfig={{
                rotate: [95, -39, 0],
                scale: 1300,
              }}
            >
              <Geographies geography={this.state.geoUrl}>
                {({ geographies }) =>
                  geographies
                    .filter((d) => d.properties.REGION_UN === "Americas")
                    .map((geo) => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill="#EAEAEC"
                        stroke="#D6D6DA"
                      />
                    ))
                }
              </Geographies>
              {locations.map(({ name, coordinates, markerOffset }) => (
                <Marker
                  key={name}
                  coordinates={coordinates}
                  onClick={() => this.selectCity(name)}
                >
                  {this.state.name === name ? (
                    <g>
                      <rect
                        className={
                          this.state.name === name
                            ? "city-rect--hover"
                            : "city-rect"
                        }
                        ry={2}
                      ></rect>
                      <text
                        className={
                          this.state.name === name
                            ? "city-text--hover"
                            : "city-text"
                        }
                        x="12"
                        y="20"
                        left={40}
                        top={4}
                      >
                        {name}
                      </text>
                    </g>
                  ) : null}
                  <circle
                    onMouseEnter={() => this.setState({ name })}
                    onMouseLeave={() => this.setState({ name: "" })}
                    className={
                      this.state.name === name
                        ? "city-circle--hover"
                        : "city-circle"
                    }
                    r={10}
                  />
                </Marker>
              ))}
            </ComposableMap>
          </div>
        )}
      </>
    );
  }
}
//we are curring the Auth component
export default withRouter(MapChart);
