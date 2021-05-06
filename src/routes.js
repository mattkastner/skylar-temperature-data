import React from "react";
import { Switch, Route } from "react-router-dom";

//Import components
import AllCitiesGraph from "./pages/AllCitiesGraph";
import Graph from "./pages/Graph";
import MapChart from "./pages/MapChart";

//Router
export default (
  <Switch>
    <Route exact path="/" component={AllCitiesGraph} />
    <Route path="/map" component={MapChart} />
    <Route path="/graph" component={Graph} />
  </Switch>
);
