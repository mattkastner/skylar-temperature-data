require("dotenv").config();

const express = require("express");
const cors = require("cors");
const spawn = require("child_process").spawn;
const fs = require("fs");
const massive = require("massive");
const csvtojson = require("csvtojson");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

// const CONNECTION_STRING = process.env.CONNECTION_STRING;

// app.use(express.static(path.join(__dirname, '../build')));

// app.get('/', function (req, res) {
//   res.sendFile(path.join(__dirname, '../build', 'index.html'));
// });

app.get("/api/temperature-data/refresh", async (req, res) => {
  let process = spawn("python", ["./population_temperatures.py"]);
  process.stdout.on("data", (data) => {
    let jsonFile = fs.readFileSync(
      path.resolve(__dirname, "cities_population_adjusted.json"),
      "utf8"
    );
    jsonFile = JSON.parse(jsonFile);
    // // console.log("ALL -- refresh");
    return res.status(200).send(jsonFile);
  });
});

app.get("/api/temperature-data/locations", async (req, res) => {
  let jsonFile = fs.readFileSync(
    path.resolve(__dirname, "city_locations.json"),
    "utf8"
  );
  jsonFile = JSON.parse(jsonFile);
  // // console.log("locations");
  return res.status(200).send(jsonFile);
});

app.put("/api/temperature-data/seasonal", (req, res) => {
  // console.log(req.body.name);

  let jsonFile = fs.readFileSync(
    path.resolve(__dirname, "cities_seasonal.json"),
    "utf8"
  );

  let finalData = JSON.parse(jsonFile);
  // console.log("seasonal");
  if (req.body.name) {
    // console.log(req.body.name);
    finalData = finalData.data.filter((row) => row.name === req.body.name);
  } else {
    // console.log("nopd=e");
    cities = {};

    finalData.data.forEach((row) => {
      if (cities[row.name] != undefined) {
        cities[row.name].dates.push(row.location_date);

        cities[row.name].series[0].data.push(row.temp_max_c);
        cities[row.name].series[1].data.push(row.temp_mean_c);
        cities[row.name].series[2].data.push(row.temp_min_c);
      } else {
        cities[row.name] = {
          name: row.name,
          dates: [row.location_date],
          series: [
            {
              name: row.name,
              data: [row.temp_max_c],
            },
            {
              name: row.name,
              data: [row.temp_mean_c],
            },
            {
              name: row.name,
              data: [row.temp_min_c],
            },
          ],
        };
      }
    });
    let overallJsonFile = fs.readFileSync(
      path.resolve(__dirname, "overall_cities_seasonal.json"),
      "utf8"
    );
    let overallData = JSON.parse(overallJsonFile);
    cities.Seasonal = {
      name: "Seasonal",
      dates: [],
      series: [
        {
          name: "Seasonal",
          data: [],
        },
        {
          name: "Seasonal",
          data: [],
        },
        {
          name: "Seasonal",
          data: [],
        },
      ],
    };
    // console.log("here",overallData.data)
    overallData.data.forEach((row) => {
      cities.Seasonal.dates.push(row.location_date);

      cities.Seasonal.series[0].data.push(row.temp_max_c);
      cities.Seasonal.series[1].data.push(row.temp_mean_c);
      cities.Seasonal.series[2].data.push(row.temp_min_c);
    });

    finalData = cities;
  }
  // console.log(req.body.name);
  return res.status(200).send(finalData);
});

app.put("/api/temperature-data/missing", async (req, res) => {
  // console.log(req.body.name);

  let jsonFile = fs.readFileSync(
    path.resolve(__dirname, "projected_temps.json"),
    "utf8"
  );
  let finalData = JSON.parse(jsonFile);
  // console.log("missing");
  if (req.body.name) {
    finalData = finalData.data.filter((row) => row.name === req.body.name);
  } else {
    cities = {};
    finalData.data.forEach((row) => {
      if (cities[row.name] != undefined) {
        if (row.projected) {
          // cities[row.name].points.push(row.projected);
          cities[row.name].xaxis.push({
            x: row.location_date,
            borderColor: "#cc8033",
            label: {
              style: {
                color: "cc8033",
              },
              // text: 'X-axis annotation - 22 Nov'
            },
          });
          cities[row.name].points[0].push({
            x: new Date(row.location_date).getTime(),
            y: row.temp_max_c,
            marker: {
              size: 5,
              fillColor: "#cc8033",
              strokeColor: "#d18d47",
              radius: 8,
            },
          });
          cities[row.name].points[1].push({
            x: new Date(row.location_date).getTime(),
            y: row.temp_mean_c,
            marker: {
              size: 5,
              fillColor: "#cc8033",
              strokeColor: "#d18d47",
              radius: 5,
            },
          });
          cities[row.name].points[2].push({
            x: row.location_date,
            y: row.temp_min_c,
            marker: {
              size: 5,
              fillColor: "#cc8033",
              strokeColor: "#d18d47",
              radius: 5,
            },
          });
        }

        cities[row.name].dates.push(row.location_date);

        cities[row.name].series[0].data.push(row.temp_max_c);
        cities[row.name].series[1].data.push(row.temp_mean_c);
        cities[row.name].series[2].data.push(row.temp_min_c);
      } else {
        cities[row.name] = {
          name: row.name,
          dates: [row.location_date],
          points: [[],[],[]],
          xaxis: [],
          series: [
            {
              name: row.name,
              data: [row.temp_max_c],
            },
            {
              name: row.name,
              data: [row.temp_mean_c],
            },
            {
              name: row.name,
              data: [row.temp_min_c],
            },
          ],
        };

        if (row.projected) {
          // cities[row.name].points.push(row.projected);
          cities[row.name].xaxis.push({
            x: row.location_date,
            borderColor: "#cc8033",
            label: {
              style: {
                color: "#cc8033",
              },
              // text: "X-axis annotation - 22 Nov",
            },
          });
          cities[row.name].points[0].push({
            x: new Date(row.location_date).getTime(),
            y: row.temp_max_c,
            marker: {
              size: 5,
              fillColor: "#cc8033",
              strokeColor: "#d18d47",
              radius: 8,
            },
          });
          cities[row.name].points[1].push({
            x: new Date(row.location_date).getTime(),
            y: row.temp_mean_c,
            marker: {
              size: 5,
              fillColor: "#cc8033",
              strokeColor: "#d18d47",
              radius: 5,
            },
          });
          cities[row.name].points[2].push({
            x: row.location_date,
            y: row.temp_min_c,
            marker: {
              size: 5,
              fillColor: "#cc8033",
              strokeColor: "#d18d47",
              radius: 5,
            },
          });
        }
      }
    });
    finalData = cities;
  }
  return res.status(200).send(finalData);
});

app.put("/api/temperature-data/monthly", async (req, res) => {
  // console.log(req.body.name);

  let jsonFile = fs.readFileSync(
    path.resolve(__dirname, "monthly_temperatures.json"),
    "utf8"
  );
  let finalData = JSON.parse(jsonFile);
  // console.log("monthly");
  if (req.body.name) {
    finalData = finalData.data.filter((row) => row.name === req.body.name);
    // console.log("monthly23");
  } else {
    cities = {};
    // console.log("monthly2");

    finalData.data.forEach((row) => {
      if (cities[row.name] != undefined) {
        cities[row.name].dates.push(row.location_date);

        cities[row.name].series[0].data.push(row.temp_max_c);
        cities[row.name].series[1].data.push(row.temp_mean_c);
        cities[row.name].series[2].data.push(row.temp_min_c);
      } else {
        cities[row.name] = {
          name: row.name,
          dates: [row.location_date],
          series: [
            {
              name: row.name,
              data: [row.temp_max_c],
            },
            {
              name: row.name,
              data: [row.temp_mean_c],
            },
            {
              name: row.name,
              data: [row.temp_min_c],
            },
          ],
        };
      }
    });
    finalData = cities;
  }
  return res.status(200).send(finalData);
});

app.get("/api/temperature-data", async (req, res) => {
  let jsonFile = fs.readFileSync(
    path.resolve(__dirname, "cities_population_adjusted.json"),
    "utf8"
  );
  let finalData = JSON.parse(jsonFile);
  // console.log("all");

  return res.status(200).send(finalData.data);
});

app.listen(process.env.SERVER_PORT || 5000, () => {
  // console.log(`SERVER IS RUNNING ON PORT ${5000}`);
});

// massive.ConnectSync(CONNECTION_STRING).then((dbInstance) => {
//   app.set("db", dbInstance);
//   // console.log("DATABASE");
// });

module.exports = { app };
