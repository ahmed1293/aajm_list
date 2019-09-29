import React from "react";
import ReactDOM from "react-dom";
import ListsProvider from "./ListsProvider";
import Tiles from "./Tiles";


const App = () => (
  <ListsProvider endpoint="api/shopping-lists/"
                 render={data => <Tiles data={data} />} />
);

const wrapper = document.getElementById("app");

wrapper ? ReactDOM.render(<App />, wrapper) : null;

