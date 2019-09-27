import React from "react";
import ReactDOM from "react-dom";
import DataProvider from "./DataProvider";
import Tiles from "./Tiles";


const App = () => (
  <DataProvider endpoint="api/shopping-lists/"
                render={data => <Tiles data={data} />} />
);

const wrapper = document.getElementById("app");

wrapper ? ReactDOM.render(<App />, wrapper) : null;