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

app.use(express.static(path.join(__dirname, '../build')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.get("/api/temperature-data/refresh", async (req, res) => {
  let process = spawn("python", ["./population_temperatures.py"]);
  process.stdout.on("data", (data) => {
    let jsonFile = fs.readFileSync(
      path.resolve(__dirname, "cities_population_adjusted.json"),
      "utf8"
    );
    jsonFile = JSON.parse(jsonFile);
    console.log("ALL -- refresh");
    return res.status(200).send(jsonFile);
  });
});

app.get("/api/temperature-data/locations", async (req, res) => {
  let jsonFile = fs.readFileSync(
    path.resolve(__dirname, "city_locations.json"),
    "utf8"
  );
  jsonFile = JSON.parse(jsonFile);
  console.log("locations");
  return res.status(200).send(jsonFile);
});

app.put("/api/temperature-data/seasonal", (req, res) => {
  console.log(req.body.name);

  let jsonFile = fs.readFileSync(
    path.resolve(__dirname, "cities_seasonal.json"),
    "utf8"
  );
  jsonFile = JSON.parse(jsonFile);
  console.log("seasonal");
  let finalData = jsonFile.data.filter((row) => row.name === req.body.name);
  return res.status(200).send(finalData);
});

app.put("/api/temperature-data/missing", async (req, res) => {
  console.log(req.body.name);

  let jsonFile = fs.readFileSync(
    path.resolve(__dirname, "projected_temps.json"),
    "utf8"
  );
  jsonFile = JSON.parse(jsonFile);
  console.log("missing");
  let finalData = jsonFile.data.filter((row) => row.name === req.body.name);
  return res.status(200).send(finalData);
});

app.put("/api/temperature-data/monthly", async (req, res) => {
  console.log(req.body.name);

  let jsonFile = fs.readFileSync(
    path.resolve(__dirname, "monthly_temperatures.json"),
    "utf8"
  );
  jsonFile = JSON.parse(jsonFile);
  let finalData = jsonFile.data.filter((row) => row.name === req.body.name);
  return res.status(200).send(finalData);
});

app.get("/api/temperature-data", async (req, res) => {
  let jsonFile = fs.readFileSync(
    path.resolve(__dirname, "cities_population_adjusted.json"),
    "utf8"
  );
  jsonFile = JSON.parse(jsonFile);
  console.log("ALL");
  return res.status(200).send(jsonFile);
});

app.listen(SERVER_PORT || 3001, () => {
  console.log(`SERVER IS RUNNING ON PORT ${8080}`);
});

// massive.ConnectSync(CONNECTION_STRING).then((dbInstance) => {
//   app.set("db", dbInstance);
//   console.log("DATABASE");
// });

module.exports = { app };
