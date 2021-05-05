import { createStore, applyMiddleware } from "redux";
import promise from "redux-promise-middleware";

import reducer from "./reducer";
const middleware = applyMiddleware(promise);

export default createStore(reducer, middleware);
