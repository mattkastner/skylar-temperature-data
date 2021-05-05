import React from "react";
import { Switch, Route } from "react-router-dom";

//Import components
import Graph from "./pages/Graph";
import MapChart from "./pages/MapChart";

//Router
export default (
  <Switch>
    <Route exact path="/" component={MapChart} />
    <Route path="/graph" component={Graph} />
  </Switch>
);
