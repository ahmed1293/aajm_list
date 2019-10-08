import React from "react";
import ReactDOM from "react-dom";
import Tiles from "./Tiles";


const App = () => (
  <Tiles/>
);

const wrapper = document.getElementById("app");

wrapper ? ReactDOM.render(<App />, wrapper) : null;

